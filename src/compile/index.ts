import { Data, ListNode, RenderData, Scene, CompileOptions } from "../types"
import { calculateBackgroundAudioTime, ListNodeFactory } from '../utils'
import { cloneDeep } from 'lodash-es'
import srtParse from 'srt-parser-2'
class Compile {
  _fileCache: Map<string, any>
  _options: CompileOptions
  _AllData: ListNodeFactory | null
  _currentNode: ListNodeFactory | null
  _playerData: RenderData | undefined
  constructor(option: CompileOptions) {
    this._fileCache = new Map()
    this._options = option
    this._AllData = null
    this._currentNode = null
    this.parseAllData()
  }

  parseAllData() {
    const scenes = this._options.scenes.reduce((pre: any[], nex: Scene) => {
      const video = {
        source: nex.material.source,
        startTime: nex.material.startTime,
        endTime: nex.material.endTime,
        duration: nex.material.duration,
        volume: nex.volume
      }
      const subtitle = {
        source: nex.subtitle?.source,
        style: nex.subtitle?.style,
        position: nex.subtitle?.position,
      }
      pre.push({
        video,
        subtitle
      })
      return pre
    }, [])
    this._AllData = new ListNodeFactory(scenes[0])
    this._currentNode = this._AllData
    let current = this._AllData
    for (let index = 1; index < scenes.length; index++) {
      const data = new ListNodeFactory(scenes[index])
      current.next = data
      current = data
    }
    this.parseData()
  }


  async parseData() {
    const data = cloneDeep(this._currentNode?.currentData)
    const videoSource = this._fileCache.get(data!.video.source) || await this.loadVideoData(data!.video.source)
    const subtitleSource = this._fileCache.get(data!.subtitle.source) || await this.loadSubtitleData(data!.subtitle.source)
    const currentData: RenderData = {
      video: {
        ...data!.video,
        source: videoSource
      },
      subtitle: {
        ...data!.subtitle,
        source: subtitleSource
      }
    }
    this._playerData = currentData
    this._options.firstDataInit()
  }

  async loadVideoData(source: string) {
    const data = await (await fetch(source)).blob()
    this._fileCache.set(source, data)
    return data
  }

  async loadSubtitleData(source: string) {
    const data = await (await fetch(source)).text()
    const parser = new srtParse()
    const srtData = parser.fromSrt(data)
    this._fileCache.set(source, srtData)
    return srtData
  }
}

export default Compile