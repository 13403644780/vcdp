import { Render, } from "../types"
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
        })
    }
}
