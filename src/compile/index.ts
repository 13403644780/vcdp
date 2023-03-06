import { Data, ListNode } from "../types"

class Compile {
  _fileCache: Map<string, Blob>
  _options: Data
  _AllData: ListNode | null
  constructor(option: Data) {
    this._fileCache = new Map()
    this._options = option
    this._AllData = null
  }

  parseAllData() {
    
  }

  cacheElement() {
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

  async syncLoaderSource(source: string) {
    return {
      result: await (await fetch(source)).blob(),
      source
    }
  }
}

export default Compile