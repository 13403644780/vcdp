import Konva from "konva"
import { Movie, } from "../types"
export class MovieRender {
    _options: Movie.Options
    _stage: Konva.Stage
    _mediaLayer: Konva.Layer
    _subtitleLayer: Konva.Layer
    _animationLayer: Konva.Layer
    _fps: Konva.Animation
    _canvasScale: number
    _videoTarget: HTMLVideoElement
    _imageCurrent: Konva.Image
    _videoEvents: Movie.VideoEvents[]
    _subtitleLabel: Konva.Label
    _subtitleTab: Konva.Tag
    _subtitleText: Konva.Text
    constructor(options: Movie.Options) {
        this._options = options
        this._canvasScale = 1
        this._videoTarget = document.createElement("video")
        this._videoEvents = [
            {
                eventName: "loadedmetadata",
                callbacks: [this.resetImage,],
            },
            {
                eventName: "timeupdate",
                callbacks: [],
            },
        ]
        this._stage = new Konva.Stage({
            container: options.container,
            width: options.width,
            height: options.height,
        })
        this._mediaLayer = new Konva.Layer({
            name: "mediaLayer",
        })
        this._subtitleLayer = new Konva.Layer({
            name: "subtitleLayer",
        })
        this._animationLayer = new Konva.Layer({
            name: "animationLayer",
        })
        this._imageCurrent = new Konva.Image({
            image: this._videoTarget,
            x: 0,
            y: 0,
        })
        this._subtitleLabel = new Konva.Label({
            x: 0,
            y: 0,
        })
        this._subtitleTab = new Konva.Tag()
        this._subtitleText = new Konva.Text({
            verticalAlign: "middle",
            lineHeight: 1.2,
            padding: 10,
        })
        this._subtitleLabel.add(this._subtitleTab)
        this._subtitleLabel.add(this._subtitleText)
        this._subtitleLayer.add(this._subtitleLabel)
        this._stage.add(this._animationLayer)
        this._stage.add(this._mediaLayer)
        this._stage.add(this._subtitleLayer)
        this._fps = new Konva.Animation(() => {
            // 
        }, this._mediaLayer)
        this.initScale()
        this.initLayer()
    }
    initScale() {
        const { clientWidth, clientHeight, } = this._options.container
        const scaleX = clientWidth / this._options.videoWidth
        const scaleY = clientHeight / this._options.videoHeight
        this._canvasScale = Math.min(scaleX, scaleY)
    }
    initVideoScale(videoWidth: number, videoHeight: number) {
        const containerWidth = this._options.videoWidth
        const containerHeight = this._options.videoHeight
        const containerRatio = containerWidth / containerHeight
        const videoRatio = videoWidth / videoHeight
        let scale = 1
        if (containerRatio > videoRatio) {
            scale = containerHeight / videoHeight
        } else if (containerRatio < videoRatio) {
            scale = containerWidth / videoWidth
        }
        return scale
    }
    initLayer() {
        this._mediaLayer.setPosition({
            x: this._stage.width() / 2 - this._options.videoWidth * this._canvasScale / 2,
            y: this._stage.height() / 2 - this._options.videoHeight * this._canvasScale / 2,
        }).scale({
            x: this._canvasScale,
            y: this._canvasScale,
        })
        this._subtitleLayer.setPosition({
            x: this._stage.width() / 2 - this._options.videoWidth * this._canvasScale / 2,
            y: this._stage.height() / 2 - this._options.videoHeight * this._canvasScale / 2,
        }).scale({
            x: this._canvasScale,
            y: this._canvasScale,
        })
        this._animationLayer.setPosition({
            x: this._stage.width() / 2 - this._options.videoWidth * this._canvasScale / 2,
            y: this._stage.height() / 2 - this._options.videoHeight * this._canvasScale / 2,
        }).scale({
            x: this._canvasScale,
            y: this._canvasScale,
        })
        const videoBackground = new Konva.Rect({
            width: this._options.videoWidth,
            height: this._options.videoHeight,
            x: 0,
            y: 0,
            fill: "#000000",
        })
        this._mediaLayer.add(videoBackground)
    }
    initVideoEvent() {
        for (let i = 0; i < this._videoEvents.length; i++) {
            this._videoTarget.addEventListener(
                this._videoEvents[i].eventName,
                this.videoEventCallback.bind(this, this._videoEvents[i].callbacks)
            )
        }
    }
    videoEventCallback(callbacks: (() => void)[]) {
        for (let i = 0; i < callbacks.length; i++) {
            callbacks[i]()
        }
    }
    resetImage() {
        const videoScale = this.initVideoScale(this._videoTarget.videoWidth, this._videoTarget.videoHeight)
        this._imageCurrent.width(this._videoTarget.videoWidth * videoScale)
        this._imageCurrent.height(this._videoTarget.videoHeight * videoScale)
        this._imageCurrent.offset({
            x: this._imageCurrent.width() / 2,
            y: this._imageCurrent.height() / 2,
        })
        this._imageCurrent.setPosition({
            x: this._options.videoWidth / 2,
            y: this._options.videoHeight/ 2,
        })
    }
}
