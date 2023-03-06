import { Config } from "../types"
import Compile from "../compile"
import Render from '../renderer'
class Core {
  _compile: Compile
  _render: Render
  constructor(options: Config) {
    this._compile = new Compile(options.data)
    this._render = new Render({
      container: typeof options.container === "string" ? document.querySelector(options.container) as HTMLDivElement : options.container,
      video: options.video
    })
  }

}

export default Core