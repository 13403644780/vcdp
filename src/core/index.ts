import { Config, RenderData } from "../types"
import Compile from "../compile"
import Render from '../renderer'
class Core {
  _compile: Compile
  _render: Render
  constructor(options: Config) {
    this._compile = new Compile({
      ...options.data,
      firstDataInit: this.initRenderData.bind(this)
    })
    this._render = new Render({
      container: typeof options.container === "string" ? document.querySelector(options.container) as HTMLDivElement : options.container,
      video: options.video
    })
    
  }
  initRenderData() {
    this._render.changeCurrentData(this._compile._playerData as RenderData)
    this._render.initSubtitle()
  }
  public play() {
    this._render._videoRef?.play()
    console.log('this._render._videoRef?.play(): ', this._render._videoRef);
    this._render._animation?.start()
  }
  public pause() {
    this._render._videoRef?.pause()
    this._render._animation?.stop()
  }

}

export default Core