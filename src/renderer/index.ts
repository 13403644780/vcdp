import { AudioConfig, CompileConfig, Fiber, Render, } from "../types"
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
            pauseImage: options.pauseImage,
            replayImage: options.replayImage,
            subtitleStyle: options.subtitleStyle,
            updateNextNode: options.updateNextNode,

        })
    }
    public update(playFiberNode: Fiber.PlayFiberNode) {
        this._movie._sceneDuration = 0
        this._movie.updateVideo(playFiberNode.video)
        this._movie.updateSubtitleSource(playFiberNode.subtitle)
        this._movie.initSceneBackground(playFiberNode.sceneBackground)
        if (playFiberNode.dub) {
            this._movie._duration = playFiberNode.dub.duration
            this._movie.updateDubbing([{
                ...playFiberNode.dub,
                loop: false,
                mute: playFiberNode.dub.mute || false,
            },])
            console.log(playFiberNode)
        } else {
            this._movie._duration = playFiberNode.video.duration
        }
    }
    public updateBackground(bgAudio: AudioConfig.Result[]) {
        this._movie.updateBackgroundAudio(bgAudio)
    }
    public updateVideoElement(elements: CompileConfig.VideoElement[]) {
        this._movie.updateVideoElement(elements)
    }
    public updateDubbing(dubbing: AudioConfig.Result[]) {
        this._movie.updateDubbing(dubbing)
    }
    public updateSceneBackground(sceneBackground: CompileConfig.SceneBackground){
        this._movie.initSceneBackground(sceneBackground)
    }
    public play() {
        this._movie._backgroundAudio.play()
        this._movie._dubAudio.play()
        this._movie._videoTarget.play()
    }
    public pause() {
        this._movie._backgroundAudio.pause()
        this._movie._dubAudio.pause()
        this._movie._videoTarget.pause()
    }
}
