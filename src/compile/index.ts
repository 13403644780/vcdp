import { Data } from "../types"

class Compile {
  _fileCache: Map<string, Blob>
  _options: Data
  constructor(option: Data) {
    this._fileCache = new Map()
    this._options = option
    this.cacheElement()
  }
  /**
   * 缓存元素数据
   */
  private cacheElement() {
    const elements = this._options.elements
    const promises = elements.filter(element => element.type === 2).map(element => {
      return this.syncLoaderSource(element.source)
    })
    Promise.all(promises)
    .then(result => {
      result.forEach(({ source, result }) => {
        this._fileCache.set(source, result)
      })
    }).catch(reason => {
      console.warn('load element Failed', reason)
    })
  }
  /**
   * 异步加载数据
   */
  private async syncLoaderSource(source: string) {
    return {
      result: await (await fetch(source)).blob(),
      source
    }
  }
}

export default Compile