import { Config, RenderData, } from "../types"
import Compile from "../compile"
import Render from "../renderer"
class Core {
    _compile: Compile
    _render: Render
    constructor(options: Config) {
        this._compile = new Compile({
            ...options.data,
            firstDataInit: this.initRenderData.bind(this),
        })
        this._render = new Render({
            container: typeof options.container === "string" ? document.querySelector(options.container) as HTMLDivElement : options.container,
            video: options.video,
            other: options.other,
            callbacks: {
                updateNext: this.updateNext.bind(this),
            },
        })
    
    }
    initRenderData() {
        this._render.initBackgroundAudios(this._compile._backgrounds)
        this._render.changeCurrentData(this._compile._playerData as RenderData)
        this._render.initSubtitle()
        this._render.disposeLoading()
    }
    async updateNext() {
        const result = await this._compile.updateNextNode()
        if (result) {
            this._render.changeCurrentData(this._compile._playerData as RenderData)
            this._render.initSubtitle()
            this._render.disposeLoading()
        }
    }
    public play() {
        this._render.play() 
    }
    public pause() {
        this._render.pause() 
    }

}

export default Core
