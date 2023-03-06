import Konva from 'konva'
import { RendererConfig } from '../types'
class Renderer {
  _options: RendererConfig
  _stage: Konva.Stage | null
  _videoLayer: Konva.Layer | null
  _containerLayer: Konva.Layer | null
  _imageRef: Konva.Image | null
  _animation: Konva.Animation | null
  _scale: number
  _videoRef: HTMLVideoElement | null
  constructor(options: RendererConfig) {
    this._options = options
    this._stage = null
    this._videoLayer = null
    this._containerLayer = null
    this._videoRef = null
    this._imageRef = null
    this._animation = null
    this._scale = 1
    this.initScale()
    this.initCanvas()
    this.initVideo()
    this.initAnimation()
  }
  initCanvas() {
    this._stage = new Konva.Stage({
      container: this._options.container,
      width: this._options.container.clientWidth,
      height: this._options.container.clientHeight,
      backgroundColor: 'lightgrey'
    })
    this._videoLayer = new Konva.Layer({
      name: "video-layer",
      x: this._stage.width() / 2 - (this._options.video.width * this._scale) / 2,
      y: this._stage.height() / 2 - (this._options.video.height * this._scale) / 2,
      scale: {
        x: this._scale,
        y: this._scale
      },
      width: this._options.video.width,
      height: this._options.video.height
    })
    this._stage.container().style.backgroundColor = '#39375B'
    this._stage.add(this._videoLayer)
  }
  initScale() {
    const { width, height } = this._options.video
    const { clientWidth, clientHeight } = this._options.container
    const scaleX = clientWidth / width
    const scaleY = clientHeight / height
    this._scale = Math.min(scaleX, scaleY)
  }
  initVideo() {
    this._videoRef = document.createElement("video")
    this._videoRef.setAttribute('src', 'https://image.liuyongzhi.cn/video/John%20Wick_%20Chapter%204%20(2023)%20Final%20Trailer%20%E2%80%93%20Keanu%20Reeves%2C%20Donnie%20Yen%2C%20Bill%20Skarsga%CC%8Ard.mp4')
    this._imageRef = new Konva.Image({
      image: this._videoRef,
      x: 0,
      y: 0
    })
    this._videoLayer?.add(this._imageRef)
    this._videoRef.addEventListener('loadedmetadata', (e) => {
      console.log("this._videoLayer!.width()", this._videoLayer!.width());
      console.log("this._videoLayer!.height()", this._videoLayer!.height());
      this._imageRef?.width(this._options.video.width)
      this._imageRef?.height(this._options.video.height)
    })
  }
  initAnimation() {
    this._animation = new Konva.Animation(function() {
      console.log('Konva.Animation: ', Konva.Animation);
      
    }, this._videoLayer)
  }
  public play() {
    this._videoRef?.play()
    this._animation?.start()
  }
  public pause() {
    this._videoRef?.pause()
    this._animation?.stop()
  }
}

export default Renderer