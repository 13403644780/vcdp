import { CoreConfig, } from "../types"
import Compile from "../compile"
import { Renderer, } from "../renderer"
class Core {
    _compile: Compile
    _render: Renderer
    constructor(options: CoreConfig.Options) {
        this._compile = new Compile({
            ...options.movieData,
            firstCompileCallback: this.LoadComplete.bind(this),
        })
        this._render = new Renderer({
            container: typeof options.container === "string" ? document.querySelector(options.container) as HTMLDivElement : options.container,
            videoWidth: options.videoWidth,
            videoHeight: options.videoHeight,
            loadingImage: options.loadingImage || "",
            subtitleStyle: options.movieData.scenes[0].subtitle?.style || {}
        })
    }
    LoadComplete() {
        if (!this._compile._fiber) {
            console.error("暂无场景数据")
            return
        }
        this._render.update(this._compile._playFiberNode)
        this._render._movie.stopLoading()
        this._render._movie._videoTarget.play()
        this._render._movie._fps.start()
        console.log(this._render)
    }

}

export default Core
