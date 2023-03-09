import Konva from 'konva'
import { merge, debounce, DebouncedFunc } from 'lodash-es'
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
  _subtitleLabel: Konva.Label | undefined
  _subtitleTag: Konva.Tag | undefined
  _proxyTarget: RenderData | undefined
  _backgroundAudio: HTMLAudioElement | undefined
  _dubAudio: HTMLAudioElement | undefined
  _Urls: string[]
  constructor(options: RendererConfig) {
    this._options = options
    this._stage = null
    this._videoLayer = null
    this._containerLayer = null
    this._videoRef = null
    this._imageRef = null
    this._animation = null
    this._scale = 1
    this._Urls = []
    this.initScale()
    this.initCanvas()
    this.initVideo()
    this.initAudio()
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
  initAudio() {
    this._backgroundAudio = new Audio()
    this._dubAudio = new Audio()
  }
  initSubtitle() {
    this._subtitleLabel = new Konva.Label({
      x: this._proxyTarget?.subtitle?.position.x,
      y: this._proxyTarget?.subtitle?.position.y
    })
    this._subtitleTag = new Konva.Tag({
      fill: this._proxyTarget?.subtitle?.style.backgroundColor,
      cornerRadius: 5
    })
    this._subtitleLabel.add(this._subtitleTag)
    this._textRef = new Konva.Text({
      text: "Konva Hello Konva ",
      fontSize: this._proxyTarget?.subtitle?.style.fontSize,
      align: this._proxyTarget?.subtitle?.style.align,
      fill: this._proxyTarget?.subtitle?.style.fill,
      fontStyle: this._proxyTarget?.subtitle?.style.fontStyle,
      stroke: this._proxyTarget?.subtitle?.style.stroke,
      strokeWidth: this._proxyTarget?.subtitle?.style.strokeWidth,
      verticalAlign: 'middle',
      lineHeight: 1.2,
      padding: 10
    })
    this._subtitleLabel.add(this._textRef)
    this.setSubtitleOffset()
    this._subtitleLayer?.add(this._subtitleLabel)
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
    requestAnimationFrame(() => {
      this._textRef?.text(text)
      this._subtitleLabel?.offset({
        x: this._textRef!.width() / 2,
        y: this._textRef!.height() / 2
      })
      this.setSubtitleOffset()
    })
  }
  setSubtitleOffset() {
    this._subtitleLabel?.offset({
      x: this._textRef!.width() / 2,
      y: this._textRef!.height() / 2
    })
    const textWidth = this._textRef!.width()
    const textHeight = this._textRef!.height()
    const maxWidth = this._options.video.width
    const maxHeight = this._options.video.height
    const styleX = this._proxyTarget!.subtitle!.position.x
    const styleY = this._proxyTarget!.subtitle!.position.y
    this._subtitleLabel?.setPosition({
      x: Math.max(textWidth / 2, Math.min(styleX, maxWidth - textWidth / 2)),
      y: Math.max(textHeight / 2, Math.min(styleY, maxHeight - textHeight / 2))
    })

  }
  proxyCurrent() {
    const renderDebounce = debounce(this.updateRenderer.bind(this), 100, {
      trailing: true,
      leading: false
    })
    this._proxyTarget = new Proxy<RenderData>({}, HandleFunc(renderDebounce))
  }
  updateRenderer() {
    this.updateVideoSource()
    this.updateAudioSource()
    this.setMediaStartTime()
  }
  updateVideoSource() {
    if (!this._proxyTarget?.video) return
    if (typeof this._proxyTarget?.video.source === 'string') {
      this._videoRef?.setAttribute('src', this._proxyTarget?.video.source)
    } else {
      const url = URL.createObjectURL(this._proxyTarget?.video.source)
      this._Urls.push(url)
      this._videoRef?.setAttribute('src', url)
    }
  }
  updateAudioSource() {
    if (!this._proxyTarget?.audio || !Array.isArray(this._proxyTarget.audio)) return
    const audio = this._proxyTarget.audio
    for (let i=0;i<audio.length ;i++) {
      const target = audio[i].type === 1 ? this._backgroundAudio : this._dubAudio
      if (typeof audio[i].source === 'string') {
        target?.setAttribute('src', audio[i].source as string)
      } else {
        const url = URL.createObjectURL(audio[i].source as Blob)
        target?.setAttribute('src', url)
      }
    }
  }
  setMediaStartTime() {
    if (this._videoRef) {
      this._videoRef.currentTime = this._proxyTarget!.video!.startTime / 1000
    }
    if (this._proxyTarget?.audio && this._proxyTarget?.audio.length >= 1) {
      const audio = this._proxyTarget?.audio
      for(let i = 0; i< audio.length; i++) {
        const target = audio[i].type === 1 ? this._backgroundAudio : this._dubAudio
        if (target) {
          target.currentTime = audio[i].startTime / 1000
        }
      }
    }
  }
  public changeCurrentData(data: RenderData) {
    merge(this._proxyTarget, data)
  }
}

const HandleFunc = <T extends {}>(renderFunction: DebouncedFunc<() => void>) => ({
  get(target: T, prop: keyof T, receiver: any) {
    return Reflect.get(target, prop, receiver)
  },

  set(target: T, prop: keyof T, value: T[keyof T], receiver: any) {
    renderFunction()
    return Reflect.set(target, prop, value, receiver)
  }
})

export default Renderer