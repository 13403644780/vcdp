import { RenderData, Scene, CompileOptions, RenderDataAudio, NodeData, } from "../types"
import { ListNodeFactory, calculationBackgroundStartTime, } from "../utils"
import { cloneDeep, } from "lodash-es"
import srtParse from "srt-parser-2"
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
                volume: nex.volume,
                mute: nex?.mute || false,
            }
            const subtitle = {
                source: nex.subtitle?.source || "",
                style: nex.subtitle?.style || {},
                position: nex.subtitle?.position || { x: 0, y: 0, },
            }
            const backgroundAudio = this.getBackgroundAudio(pre, nex)
            const dubAudio = this.getDubAudio(nex)
            pre.push({
                video,
                subtitle,
                backgroundAudio,
                dubAudio,
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
        const videoSource = this._fileCache.get(data.video.source) || await this.loadMediaData(data.video.source)
        const subtitleSource = this._fileCache.get(data.subtitle.source) || await this.loadSubtitleData(data.subtitle.source)
        const audio = await this.parseAudioData(data as NodeData)
        const currentData: RenderData = {
            video: {
                ...data.video,
                source: videoSource,
            },
            subtitle: {
                ...data.subtitle,
                source: subtitleSource,
            },
            audio: audio || undefined,
        }
        this._playerData = currentData
        this._options.firstDataInit()
    }

    async parseAudioData(data: NodeData) {
        const result = []
        const dubAudio = await this.parseAudio(data.dubAudio)
        const backgroundAudio = await this.parseAudio(data.backgroundAudio)
        dubAudio && result.push(dubAudio)
        backgroundAudio && result.push(backgroundAudio)
        return result.length && result
    }

    async loadMediaData(source: string) {
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
            const previousTime = pre.reduce((p, n) => p + (n.video.endTime - n.video.startTime), 0)
            const { startTime, endTime, } = calculationBackgroundStartTime(
                previousTime,
                nex.duration,
                this._options.backgroundAudio?.startTime || 0,
                this._options.backgroundAudio?.endTime || 0,
                this._options.backgroundAudio?.repeat)
            if (startTime !== -1) {
                return {
                    source: this._options.backgroundAudio.source,
                    startTime: startTime,
                    endTime: endTime,
                    volume: this._options.backgroundAudio.volume,
                    mute: this._options.backgroundAudio?.mute || false,
                    type: 1,
                }
            }
        }
        return undefined
    }

    getDubAudio(nex: Scene) {
        if (nex.dub) {
            return {
                source: nex.dub?.source || "",
                startTime: nex.dub?.startTime || -1,
                endTime: nex.dub?.endTime || -1,
                volume: nex.dub?.volume || -1,
                mute: nex.dub?.mute,
                type: 2,
            }
        }
        return undefined
    }
    async parseAudio(audio: RenderDataAudio | undefined) {
        if (!audio) return
        const source: Blob = this._fileCache.get(audio.source as string) || await this.loadMediaData(audio.source as string)
        return {
            ...audio,
            source,
        }
    }

}

export default Compile
