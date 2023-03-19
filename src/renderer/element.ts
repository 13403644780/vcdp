
import Konva from "konva"
import { CompileConfig } from "src/types"
export class Element {
  _options: CompileConfig.VideoElement[]
  _layer: Konva.Layer
  _elements: (Konva.Text | Konva.Image) []
  constructor(options: CompileConfig.VideoElement[], layer: Konva.Layer) {
    this._options = options
    this._layer = layer
    this._elements = []
    this.init()
    this.render()
  }
  init() {
    for (let i = 0; i < this._options.length; i ++) {
      if (this._options[i].type === 0) {
        this._elements.push(new Konva.Text({
          text: this._options[i].source,
          ...this._options[i].style
        }))
      } else {
        const target = document.createElement("img")
        target.src = this._options[i].source
        this._elements.push(new Konva.Image({
          image: target,
          ...this._options[i].style
        }))
      }
    }
  }
  render() {
    for (let i = 0; i < this._elements.length; i ++) {
      this._layer.add(this._elements[i])
    }
  }
}
