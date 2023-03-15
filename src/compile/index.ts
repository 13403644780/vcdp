import { FiberFactory, } from "../utils"
import { CompileConfig, } from "../types"
class Compile {
    _cache: Map<string, Blob>
    _urlsCache: Map<string, string>
    _fiber: FiberFactory
    constructor(options: CompileConfig.Options) {
        this._cache = new Map()
        this._urlsCache = new Map()
    }
    initFiber() {

    }
}

export default Compile
