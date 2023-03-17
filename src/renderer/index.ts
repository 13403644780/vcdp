import { AudioConfig, Fiber, Render, } from "../types"
import { MovieRender, } from "./movie"
export class Renderer {
    _options: Render.Options
    _movie: MovieRender
    constructor(options: Render.Options) {
        this._options = options
        this._movie = new MovieRender({
            container: options.container,
            videoHeight: options.videoHeight,
            videoWidth: options.videoWidth,
            width: options.container.clientWidth,
            height: options.container.clientHeight,
            loadingImage: options.loadingImage,
            subtitleStyle: options.subtitleStyle
        })
    }
    public update(playFiberNode: Fiber.PlayFiberNode) {
        this._movie.updateVideo(playFiberNode.video)
        this._movie.updateSubtitleSource(playFiberNode.subtitle)
    }
    public updateBackground(bgAudio: AudioConfig.Result[]) {
        this._movie.updateBackgroundAudio(bgAudio)
    }
    public play() {
        this._movie._backgroundAudio.play()
        this._movie._videoTarget.play()
    }
    public pause() {
        this._movie._backgroundAudio.pause()
        this._movie._videoTarget.pause()
    }
}
