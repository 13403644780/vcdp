import Konva from 'konva'
import { RendererConfig } from '../types'
class Renderer {
  _options: RendererConfig
  _stage: Konva.Stage | null
  _videoLayer: Konva.Layer | null
  _containerLayer: Konva.Layer | null
  _scale: number
  constructor(options: RendererConfig) {
    console.log(options)
    this._options = options
    this._stage = null
    this._videoLayer = null
    this._containerLayer = null
    this._scale = 1
    this.initScale()
    this.initCanvas()
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
    
  }
}

export default Renderer