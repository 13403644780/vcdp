import { RenderData, Scene, CompileOptions, NodeData, RenderDataAudio, } from "../types"
import { ListNodeFactory, } from "../utils"
import { cloneDeep, } from "lodash-es"
import srtParse from "srt-parser-2"
class Compile {
    _fileCache: Map<string, any>
    _options: CompileOptions
    _AllData: ListNodeFactory | null
    _currentNode: ListNodeFactory | undefined
    _playerData: RenderData | undefined
    _BlobUrls: string[] | undefined
    _backgrounds: RenderDataAudio[]
    constructor(option: CompileOptions) {
        this._fileCache = new Map()
        this._options = option
        this._AllData = null
        this._backgrounds = []
        this.parseAllData()
    }

    async parseAllData() {
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
            const dubAudio = this.getDubAudio(nex)
            pre.push({
                video,
                subtitle,
                dubAudio,
            })
            return pre
        }, [])
        this._AllData = new ListNodeFactory(scenes[0], true)
        this._currentNode = this._AllData
        let current = this._AllData
        for (let index = 1; index < scenes.length; index++) {
            const data = new ListNodeFactory(scenes[index], false, index === scenes.length - 1)
            current.next = data
            current = data
        }
        await this.parseBackgroundAudio()
        this.parseData()
    }
    async parseBackgroundAudio() {
        const bgAudios = this._options.backgroundAudio || []
        const promises = bgAudios.map(item => this.loadMediaData(item.source))
        const results = await Promise.all(promises)
        const data = bgAudios.map((item) => {
            const blob = results.find(result => result.source === item.source)?.data
            if (!blob) return
            const bgUrl = URL.createObjectURL(blob)
            this._BlobUrls?.push(bgUrl)
            return {
                ...item,
                source: bgUrl,
                mute: item.mute,
                volume: item.volume,
                startTime: item.startTime,
                endTime: item.endTime,
                repeat: item.repeat || false,
            }
        })
        this._backgrounds = data.filter(item => item !== undefined) as RenderDataAudio[]
    }


    async parseData() {
        if (!this._currentNode) return
        const data = cloneDeep(this._currentNode.currentData)
        const videoSource = this._fileCache.get(data.video.source) || await (await this.loadMediaData(data.video.source)).data
        const subtitleSource = this._fileCache.get(data.subtitle.source) || await this.loadSubtitleData(data.subtitle.source)
        const currentData: RenderData = {
            video: {
                ...data.video,
                source: videoSource,
            },
            subtitle: {
                ...data.subtitle,
                source: subtitleSource,
            },
            head: this._currentNode.head,
            last: this._currentNode.last,
        }
        this._playerData = currentData
        this._options.firstDataInit()
    }
    async loadMediaData(source: string) {
        const data = await (await fetch(source)).blob()
        this._fileCache.set(source, data)
        return {
            source,
            data,
        }
    }

    async loadSubtitleData(source: string) {
        const data = await (await fetch(source)).text()
        const parser = new srtParse()
        const srtData = parser.fromSrt(data)
        this._fileCache.set(source, srtData)
        return srtData
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
    async updateNextNode() {
        this._currentNode = this._currentNode?.next
        if (!this._currentNode) return false
        await this.updateParseData()
        return true
    }
    async updateParseData() {
        if (!this._currentNode) return
        const data = cloneDeep(this._currentNode.currentData)
        const videoSource = this._fileCache.get(data.video.source) || await (await this.loadMediaData(data.video.source)).data
        const subtitleSource = this._fileCache.get(data.subtitle.source) || await this.loadSubtitleData(data.subtitle.source)
        const currentData: RenderData = {
            video: {
                ...data.video,
                source: videoSource,
            },
            subtitle: {
                ...data.subtitle,
                source: subtitleSource,
            },
            head: this._currentNode.head,
            last: this._currentNode.last,
        }
        this._playerData = currentData
    }

}

export default Compile
