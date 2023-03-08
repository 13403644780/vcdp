import { Data, ListNode, RenderData, Scene, CompileOptions, RenderDataAudio, NodeData } from "../types"
import { ListNodeFactory, calculationBackgroundStartTime } from '../utils'
import { cloneDeep } from 'lodash-es'
import srtParse from 'srt-parser-2'
class Compile {
  _fileCache: Map<string, any>
  _options: CompileOptions
  _AllData: ListNodeFactory | null
  _currentNode: ListNodeFactory | undefined
  _playerData: RenderData | undefined
  _BlobUrls: string[] | undefined
  constructor(option: CompileOptions) {
    this._fileCache = new Map()
    this._options = option
    this._AllData = null
    this.parseAllData()
  }

  parseAllData() {
    const scenes = this._options.scenes.reduce((pre: NodeData[], nex: Scene) => {
      const video = {
        source: nex.material.source,
        startTime: nex.material.startTime,
        endTime: nex.material.endTime,
        duration: nex.material.duration,
        volume: nex.volume
      }
      const subtitle = {
        source: nex.subtitle?.source || '',
        style: nex.subtitle?.style || {},
        position: nex.subtitle?.position || {x: 0, y: 0},
      }
      const backgroundAudio = this.getBackgroundAudio(pre, nex)
      const dubAudio = this.getDubAudio(nex)
      pre.push({
        video,
        subtitle,
        backgroundAudio,
        dubAudio
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
    if (!this._currentNode) return
    const data = cloneDeep(this._currentNode.currentData)
    const videoSource = this._fileCache.get(data.video.source) || await this.loadVideoData(data.video.source)
    const subtitleSource = this._fileCache.get(data.subtitle.source) || await this.loadSubtitleData(data.subtitle.source)
    this.parseAudioData(data as NodeData)
    const currentData: RenderData = {
      video: {
        ...data.video,
        source: videoSource
      },
      subtitle: {
        ...data.subtitle,
        source: subtitleSource
      },
      audio: []
    }
    this._playerData = currentData
    this._options.firstDataInit()
  }

  parseAudioData(data: NodeData) {
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

  getBackgroundAudio(pre: NodeData[], nex: Scene) {
    if (this._options.backgroundAudio) {
      const previousTime = pre.reduce((p, n) => p + n.video.duration, 0)
      const startTime = calculationBackgroundStartTime(previousTime, nex.duration, this._options.backgroundAudio?.duration || 0, this._options.backgroundAudio?.repeat)
      if (startTime !== -1) {
      const startTime = calculationBackgroundStartTime(previousTime, nex.duration, this._options.backgroundAudio?.duration || 0, this._options.backgroundAudio?.repeat)
        return {
          source: this._options.backgroundAudio.source,
          startTime: startTime,
          endTime: startTime + nex.duration,
          volume: this._options.backgroundAudio.volume,
          mute: this._options.backgroundAudio?.mute || false
        }
      }
    }
    return undefined
  }

  getDubAudio(nex: Scene) {
    if (nex.dub) {
      return {
        source: nex.dub?.source || '',
        startTime: nex.dub?.startTime || -1,
        endTime: nex.dub?.endTime || -1,
        volume: nex.dub?.volume || -1,
        mute: nex.dub?.mute
      }
    }
    return undefined
  }

}

export default Compile