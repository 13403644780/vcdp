import Konva from 'konva'
import { merge, debounce } from 'lodash-es'
import { RendererConfig, ListNode, RenderData, parseSubtitle } from '../types'
import { getCurrentTimeSubtitleText } from '../utils'


class Renderer {
  _options: RendererConfig
  _stage: Konva.Stage | null
  _videoLayer: Konva.Layer | null
  _subtitleLayer: Konva.Layer | undefined
  _containerLayer: Konva.Layer | null
  _imageRef: Konva.Image | null
  _animation: Konva.Animation | null
  _scale: number
  _videoRef: HTMLVideoElement | null
  _textRef: Konva.Text | undefined
  _proxyTarget: RenderData | undefined
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
    this.proxyCurrent()
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
      height: this._options.video.height,
    })
    this._subtitleLayer = new Konva.Layer({
      name: "subtitle-layer",
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
    this._videoLayer.zIndex(1)
    this._subtitleLayer.zIndex(2)
    this._stage.add(this._videoLayer)
    this._stage.add(this._subtitleLayer)
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
    this._imageRef = new Konva.Image({
      image: this._videoRef,
      x: 0,
      y: 0
    })
    this._videoLayer?.add(this._imageRef)
    this._videoRef.addEventListener('loadedmetadata', (e) => {
      this._imageRef?.width(this._options.video.width)
      this._imageRef?.height(this._options.video.height)
    })
  }
  initSubtitle() {
    this._textRef = new Konva.Text({
      x: this._proxyTarget?.subtitle?.position.x,
      y: this._proxyTarget?.subtitle?.position.y,
      fontSize: this._proxyTarget?.subtitle?.style.fontSize,
      align: this._proxyTarget?.subtitle?.style.align,
      fill: '#FFFFFF',
      fontStyle: this._proxyTarget?.subtitle?.style.fontStyle,
      stroke: this._proxyTarget?.subtitle?.style.stroke,
      strokeWidth: this._proxyTarget?.subtitle?.style.strokeWidth,
      padding: 10
    })
    this.setSubtitleOffset()
    this._subtitleLayer?.add(this._textRef)
  }
  initAnimation() {
    this._animation = new Konva.Animation(() => {
      this.updateSubtitle()
    }, this._videoLayer)
  }
  updateSubtitle() {
    const result = getCurrentTimeSubtitleText(this._videoRef!.currentTime, this._proxyTarget!.video!.startTime, this._proxyTarget!.subtitle!.source as parseSubtitle[])
    if (!result) return
    const { text } = result
    this._textRef?.text(text)
    this.setSubtitleOffset()
  }
  setSubtitleOffset() {
    const x = this._proxyTarget?.subtitle?.position.x
    const y = this._proxyTarget?.subtitle?.position.y
    const currentHeight = this._textRef?.height()
    const currentWidth = this._textRef?.width()
    const maxHeight = this._videoLayer?.height()
    const maxwidth = this._videoLayer?.width()
    if (x !== undefined && y !== undefined && currentWidth !== undefined && currentHeight !== undefined && maxHeight !== undefined && maxwidth !== undefined) {
      if (y - currentHeight < 0) {
        this._textRef?.offsetY(Math.abs(y - currentHeight))
      }else if (y + currentHeight > maxHeight) {
        this._textRef?.offsetY(maxHeight - y + currentHeight)
      } else {
        this._textRef?.offsetY(this._textRef.height() / 2)
      }
      if (x - currentWidth < 0) {
        this._textRef?.offsetX(Math.abs(x - currentHeight))
      } else if (x + currentWidth > maxwidth) {
        this._textRef?.offsetX(maxwidth - x + currentWidth)
      } else {
        this._textRef?.offsetX(this._textRef.width() / 2)
      }
    }
  }
  proxyCurrent() {
    const self = this
    this._proxyTarget = new Proxy<RenderData>({}, HandleFunc(self))
  }
  updateRenderer() {
    this.updateVideoSource()
  }
  updateVideoSource() {
    if (!this._proxyTarget?.video) return
    if (typeof this._proxyTarget?.video.source === 'string') {
      this._videoRef?.setAttribute('src', this._proxyTarget?.video.source)
    } else {
      const url = URL.createObjectURL(this._proxyTarget?.video.source)
      this._videoRef?.setAttribute('src', url)
    }
  }
  public changeCurrentData(data: RenderData) {
    merge(this._proxyTarget, data)
  }
}

const HandleFunc = <T extends {}>(self: Renderer) => ({
  get(target: T, prop: keyof T, receiver: any) {
    return Reflect.get(target, prop, receiver)
  },

  set(target: T, prop: keyof T, value: T[keyof T], receiver: any) {
    self.updateRenderer()
    return Reflect.set(target, prop, value, receiver)
  }
})

export default Renderer