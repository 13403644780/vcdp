import { Config, } from "../types"
import Compile from "../compile"
import { Renderer, } from "../renderer"
class Core {
    _compile: Compile
    _render: Renderer
    constructor(options: Config) {
        this._compile = new Compile({
            ...options.data,
            firstCompileCallback: this.LoadComplete.bind(this),
        })
        this._render = new Renderer({
            container: typeof options.container === "string" ? document.querySelector(options.container) as HTMLDivElement : options.container,
            videoWidth: options.video.width,
            videoHeight: options.video.height,
            loadingImage: options.other?.loadingImage || "",
        })
    }
    LoadComplete() {
        if (!this._compile._playerData) {
            console.error("暂无场景数据")
            return
        }
        console.log(this._compile._playerData)
        this._render._movie.updateVideo(this._compile._playerData.video)
    }

}

export default Core
