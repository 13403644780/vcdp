
import Konva from "konva"
import { CompileConfig, } from "src/types"
export class Element {
    _options: CompileConfig.VideoElement[]
    _layer: Konva.Layer
    _elements: (Konva.Text | Konva.Image)[]
    _maxWidth: number
    _maxHeight: number
    _scale: number
    constructor(options: CompileConfig.VideoElement[], layer: Konva.Layer, maxHeight: number, maxWidth: number, scale: number) {
        this._options = options
        this._layer = layer
        this._scale = scale
        this._elements = []
        this._maxWidth = maxWidth
        this._maxHeight = maxHeight
        this.dispose()
        this.init()
        this.render()
    
    }
    init() {
        for (let i = 0; i < this._options.length; i++) {
            if (this._options[i].type === 0) {
                const element = new Konva.Text({
                    text: this._options[i].source,
                    ...this._options[i].style,
                    padding: (this._options[i].style.padding || 0) + (this._options[i].style.strokeWidth || 0),
                })
                this.initPosition(element, this._options[i].style.x || 0, this._options[i].style.y || 0)
                this._elements.push(element)
            } else {
                const target = document.createElement("img")
                target.src = this._options[i].source
                const element = new Konva.Image({
                    image: target,
                    ...this._options[i].style,
                })
                this.initPosition(element, this._options[i].style.x || 0, this._options[i].style.y || 0)
                this._elements.push(element)
            }
        }
    }
    render() {
        for (let i = 0; i < this._elements.length; i++) {
            this._layer.add(this._elements[i])
        }
    }
    initPosition(element: Konva.Text | Konva.Image, styleX: number, styleY: number) {
        const currentWidth = element.width()
        const currentHeight = element.height()
        element.scale({
            x: this._scale,
            y: this._scale,
        })
        element.offset({
            x: currentWidth / 2,
            y: currentHeight / 2,
        })
        
        element.setPosition({
            x: Math.max(currentWidth / 2, Math.min(styleX, this._maxWidth - currentHeight / 2)),
            y: Math.max(currentHeight / 2, Math.min(styleY, this._maxHeight - currentHeight / 2)),
        })
    }
    dispose() {
        this._elements.forEach(element => {
            element.remove()
        })
    }
    public findElement(name: string) {
        return this._elements.find(element => element.name() === name)
    }
}
