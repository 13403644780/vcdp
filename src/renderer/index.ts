import Konva from "konva"
import { merge, debounce, DebouncedFunc, throttle, } from "lodash-es"
import { RendererConfig, RenderData, parseSubtitle, } from "../types"
import { getCurrentTimeSubtitleText, } from "../utils"


class Renderer {
    _options: RendererConfig
    _stage: Konva.Stage | null
    _videoLayer: Konva.Layer | null
    _subtitleLayer: Konva.Layer | undefined
    _containerLayer: Konva.Layer | undefined
    _animationLayer: Konva.Layer | undefined
    _imageRef: Konva.Image | null
    _animation: Konva.Animation | null
    _scale: number
    _videoRef: HTMLVideoElement | null
    _loadingRef: Konva.Image | undefined
    _animationRef: Konva.Animation | undefined
    _textRef: Konva.Text | undefined
    _subtitleLabel: Konva.Label | undefined
    _subtitleTag: Konva.Tag | undefined
    _proxyTarget: RenderData | undefined
    _backgroundAudio: HTMLAudioElement | undefined
    _dubAudio: HTMLAudioElement | undefined
    _Urls: string[]
    _updateNext: DebouncedFunc<() => void>
    constructor(options: RendererConfig) {
        this._options = options
        this._stage = null
        this._videoLayer = null
        this._videoRef = null
        this._imageRef = null
        this._animation = null
        this._scale = 1
        this._Urls = []
        this.initScale()
        this.initCanvas()
        this.initVideo()
        this.initLoading()
        this.initAudio()
        this.initAnimation()
        this.proxyCurrent()
        this._updateNext = throttle(options.callbacks.updateNext, 100, {
            leading: true,
            trailing: false,
        })
    }
    /**
     * 初始化画布
     */
    initCanvas() {
        this._stage = new Konva.Stage({
            container: this._options.container,
            width: this._options.container.clientWidth,
            height: this._options.container.clientHeight,
            backgroundColor: "lightgrey",
        })
        this._videoLayer = new Konva.Layer({
            name: "video-layer",
            x: this._stage.width() / 2 - this._options.video.width * this._scale / 2,
            y: this._stage.height() / 2 - this._options.video.height * this._scale / 2,
            scale: {
                x: this._scale,
                y: this._scale,
            },
            width: this._options.video.width,
            height: this._options.video.height,
        })
        this._subtitleLayer = new Konva.Layer({
            name: "subtitle-layer",
            x: this._stage.width() / 2 - this._options.video.width * this._scale / 2,
            y: this._stage.height() / 2 - this._options.video.height * this._scale / 2,
            scale: {
                x: this._scale,
                y: this._scale,
            },
            width: this._options.video.width,
            height: this._options.video.height,
        })
        this._animationLayer = new Konva.Layer({
            name: "animation-layer",
            x: this._stage.width() / 2 - this._options.video.width * this._scale / 2,
            y: this._stage.height() / 2 - this._options.video.height * this._scale / 2,
            scale: {
                x: this._scale,
                y: this._scale,
            },
            width: this._options.video.width,
            height: this._options.video.height,
        })
        this._stage.container().style.backgroundColor = "#39375B"
        this._videoLayer.zIndex(1)
        this._subtitleLayer.zIndex(2)
        this._stage.add(this._videoLayer)
        this._stage.add(this._subtitleLayer)
        this._stage.add(this._animationLayer)
    }
    /**
     * 计算缩放值
     */
    initScale() {
        const { width, height, } = this._options.video
        const { clientWidth, clientHeight, } = this._options.container
        const scaleX = clientWidth / width
        const scaleY = clientHeight / height
        this._scale = Math.min(scaleX, scaleY)
    }
    /**
     * 初始化视频元素
     */
    initVideo() {
        this._videoRef = document.createElement("video")
        this._imageRef = new Konva.Image({
            image: this._videoRef,
            x: 0,
            y: 0,
        })
        this._videoLayer?.add(this._imageRef)
        this._videoRef.addEventListener("loadedmetadata", () => {
            this._imageRef?.width(this._options.video.width)
            this._imageRef?.height(this._options.video.height)
        })
        this._videoRef.addEventListener("timeupdate", () => {
            this.updateSubtitle()
            this.validateNext()
        })
    }
    /**
     * 初始化音频节点
     */
    initAudio() {
        this._backgroundAudio = new Audio()
        this._dubAudio = new Audio()
    }
    /**
     * 初始化字幕元素
     */
    initSubtitle() {
        this._subtitleLabel = new Konva.Label({
            x: this._proxyTarget?.subtitle?.position.x,
            y: this._proxyTarget?.subtitle?.position.y,
        })
        this._subtitleTag = new Konva.Tag({
            fill: this._proxyTarget?.subtitle?.style.backgroundColor,
            cornerRadius: 5,
        })
        this._subtitleLabel.add(this._subtitleTag)
        this._textRef = new Konva.Text({
            text: "",
            fontSize: this._proxyTarget?.subtitle?.style.fontSize,
            align: this._proxyTarget?.subtitle?.style.align,
            fill: this._proxyTarget?.subtitle?.style.fill,
            fontStyle: this._proxyTarget?.subtitle?.style.fontStyle,
            stroke: this._proxyTarget?.subtitle?.style.stroke,
            strokeWidth: this._proxyTarget?.subtitle?.style.strokeWidth,
            verticalAlign: "middle",
            lineHeight: 1.2,
            padding: 10,
        })
        this._subtitleLabel.add(this._textRef)
        this.setSubtitleOffset()
        this._subtitleLayer?.add(this._subtitleLabel)
    }
    /**
     * 整个画布的更新操作
     */
    initAnimation() {
        this._animation = new Konva.Animation(() => {
        }, this._videoLayer)
    }
    /**
     * 初始化loading元素
     */
    initLoading() {
        const image = document.createElement("img")
        image.src = this._options.other?.loadingImage || ""
        image.onload = () => {
            this._loadingRef = new Konva.Image({
                name: "loading-ref",
                image: image,
                x: this._options.video.width / 2,
                y: this._options.video.height / 2,
                width: 100,
                height: 100,
                offset: {
                    x: 50,
                    y: 50,
                },
            })
            this._animationLayer?.add(this._loadingRef)
            this.initOtherAnimation()
        }
    }
    /**
     * 初始化业务之外的动画
     */
    initOtherAnimation() {
        const speed = 100
        this._animationRef = new Konva.Animation((frame) => {
            if (frame !== undefined) {
                const angleDiff = frame.timeDiff * speed / 1000
                this._loadingRef?.rotate(angleDiff)
            }
        }, this._animationLayer)
        this._animationRef.start()
    }
    /**
     * 字幕更新函数
     * @returns 
     */
    updateSubtitle() {
        const result = getCurrentTimeSubtitleText(this._videoRef!.currentTime, this._proxyTarget!.video!.startTime, this._proxyTarget!.subtitle!.source as parseSubtitle[])
        if (!result) return
        const { text, } = result
        requestAnimationFrame(() => {
            this._textRef?.text(text)
            this._subtitleLabel?.offset({
                x: this._textRef!.width() / 2,
                y: this._textRef!.height() / 2,
            })
            this.setSubtitleOffset()
        })
    }
    /**
     * 设置元素位置
     */
    setSubtitleOffset() {
        this._subtitleLabel?.offset({
            x: this._textRef!.width() / 2,
            y: this._textRef!.height() / 2,
        })
        const textWidth = this._textRef!.width()
        const textHeight = this._textRef!.height()
        const maxWidth = this._options.video.width
        const maxHeight = this._options.video.height
        const styleX = this._proxyTarget!.subtitle!.position.x
        const styleY = this._proxyTarget!.subtitle!.position.y
        this._subtitleLabel?.setPosition({
            x: Math.max(textWidth / 2, Math.min(styleX, maxWidth - textWidth / 2)),
            y: Math.max(textHeight / 2, Math.min(styleY, maxHeight - textHeight / 2)),
        })

    }
    /**
     * 代理当前节点
     */
    proxyCurrent() {
        const renderDebounce = debounce(this.updateRenderer.bind(this), 100, {
            trailing: true,
            leading: false,
        })
        this._proxyTarget = new Proxy<RenderData>({}, HandleFunc(renderDebounce))
    }
    /**
     * 当前节点更新的副作用
     */
    async updateRenderer() {
        console.log("updateRender")
        await this.updateVideoSource()
        await this.setMediaStartTime()
        this.updateAudioSource()
    }
    /**
     * 停止当前节点音视频及字幕，清除画布
     */
    disposeCurrentNode() {
        this._videoRef?.pause()
        this._backgroundAudio?.pause()
        this._dubAudio?.pause()
        this._imageRef?.remove()
        this._subtitleLabel?.remove()
    }
    /**
     * 更新视频播放器内容
     * @returns 
     */
    updateVideoSource() {
        console.log(!this._imageRef || !this._proxyTarget?.video || !this._videoRef || !this._videoLayer)
        if (!this._imageRef || !this._proxyTarget?.video || !this._videoRef || !this._videoLayer) return
        console.log("更新视频播放器")
        if (typeof this._proxyTarget.video.source === "string") {
            this._videoRef.setAttribute("src", this._proxyTarget?.video.source)
        } else {
            const url = URL.createObjectURL(this._proxyTarget.video.source)
            this._Urls.push(url)
            this._videoRef.setAttribute("src", url)
        }
        this._videoLayer.add(this._imageRef)
    }
    /**
     * 更新音频播放器内容
     * @returns 
     */
    updateAudioSource() {
        if (!this._proxyTarget?.audio || !Array.isArray(this._proxyTarget.audio)) return
        const audio = this._proxyTarget.audio
        for (let i = 0; i < audio.length; i++) {
            const target = audio[i].type === 1 ? this._backgroundAudio : this._dubAudio
            if (typeof audio[i].source === "string") {
                target?.setAttribute("src", audio[i].source as string)
            } else {
                const url = URL.createObjectURL(audio[i].source as Blob)
                this._Urls.push(url)
                target?.setAttribute("src", url)
            }
            target!.volume = audio[i].volume / 100
            target!.muted = audio[i].mute
        }
    }
    /**
     * 设置媒体播放器开始时间
     */
    setMediaStartTime() {
        if (this._videoRef) {
            this._videoRef.currentTime = this._proxyTarget!.video!.startTime / 1000
        }
        if (this._proxyTarget?.audio && this._proxyTarget?.audio.length >= 1) {
            const audio = this._proxyTarget?.audio
            for (let i = 0; i < audio.length; i++) {
                const target = audio[i].type === 1 ? this._backgroundAudio : this._dubAudio
                if (target) {
                    target.currentTime = audio[i].startTime / 1000
                }
            }
        }
    }
    /**
     * 当前节点播放完毕回调函数
     * @returns 
     */
    validateNext() {
        if (!this._videoRef || this._proxyTarget?.video?.endTime === undefined) return
        const currentTime = this._videoRef.currentTime * 1000
        const targetEndTime = this._proxyTarget.video.endTime
        if (currentTime >= targetEndTime) {
            this.disposeCurrentNode()
            this.startLoading()
            this._updateNext()
        }
    }
    /**
     * 修改当前节点
     * @param data 
     */
    public changeCurrentData(data: RenderData) {
        merge(this._proxyTarget, data)
    }
    /**
     * 销毁loading
     */
    public disposeLoading() {
        this._loadingRef?.remove()
        this._animationRef?.stop()
    }
    /**
         * 开始loading
         */
    public startLoading() {
        if (!this._loadingRef) return
        this._animationLayer?.add(this._loadingRef)
        this._animationRef?.start()
    }
}

const HandleFunc = <T extends {}>(renderFunction: DebouncedFunc<() => void>) => ({
    get(target: T, prop: keyof T, receiver: any) {
        return Reflect.get(target, prop, receiver)
    },

    set(target: T, prop: keyof T, value: T[keyof T], receiver: any) {
        renderFunction()
        console.log("update")
        return Reflect.set(target, prop, value, receiver)
    },
})

export default Renderer
