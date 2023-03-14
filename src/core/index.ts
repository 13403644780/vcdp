import { Config, } from "../types"
import Compile from "../compile"
import { Renderer, } from "../renderer"
class Core {
    _compile: Compile
    _render: Renderer
    constructor(options: Config) {
        this._compile = new Compile({
            ...options.data,
            firstDataInit: () => null,
        })
        this._render = new Renderer({
            container: typeof options.container === "string" ? document.querySelector(options.container) as HTMLDivElement : options.container,
            videoWidth: options.video.width,
            videoHeight: options.video.height,
            loadingImage: options.other?.loadingImage || "",
        })
    }


}

export default Core
