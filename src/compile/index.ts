import { FiberFactory, } from "../utils"
import { CompileConfig, } from "../types"
class Compile {
    _cache: Map<string, Blob>
    _urlsCache: Map<string, string>
    _fiber: FiberFactory
    _movieData: CompileConfig.MovieData
    constructor(options: CompileConfig.Options) {
        this._cache = new Map()
        this._urlsCache = new Map()
        this._movieData = {
            backgroundAudios: options.backgroundAudios,
            scenes: options.scenes,
            elements: options.elements,
        }
        this.initFiber()
    }
    initFiber() {
        console.log(this._movieData)
    }
}

export default Compile
