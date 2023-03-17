import { FiberFactory, loadMediaSource, setFileCache, setUrlCache,} from "../utils"
import { CompileConfig, AudioConfig, Fiber, } from "../types"
import srtParse from "srt-parser-2"
class Compile {
    _cache: Map<string, Blob>
    _urlsCache: Map<string, string>
    _fiber: FiberFactory
    _currentFiberNode: FiberFactory
    _playFiberNode: Fiber.PlayFiberNode
    _movieData: CompileConfig.MovieData
    _backgroundAudios: AudioConfig.Result[]
    constructor(options: CompileConfig.Options) {
        this._cache = new Map()
        this._urlsCache = new Map()
        this._movieData = {
            backgroundAudios: options.backgroundAudios,
            scenes: options.scenes,
            elements: options.elements,
        }
        this.initFiber()
        this._currentFiberNode = this._fiber
        Promise.all([this.parseBackgroundAudio(), this.parseCurrentFiberData(),]).then(() => {
            options.firstCompileCallback()
        })
    }
    initFiber() {
        let currentNode: any = undefined
        const scenes = this._movieData.scenes
        const sceneResult = this.parseFiber(scenes[0])
        this._fiber = new FiberFactory(sceneResult, true, false)
        currentNode = this._fiber
        for (let i = 1; i < scenes.length; i++) {
            const scene = scenes[i]
            const sceneResult = this.parseFiber(scene)
            currentNode.next = new FiberFactory(sceneResult, false, i === scenes.length - 1)
            currentNode = currentNode.next
        }
    }
    parseFiber(scene: CompileConfig.Scene): Fiber.FiberData {
        const result = {
            video: {},
            dub: {},
            subtitle: {},
        }
        const { source,startTime, endTime, volume, mute, } = scene.video
        result.video = {
            source,
            startTime,
            endTime,
            volume,
            mute: mute || false,
        }
        if (scene.dub?.source) {
            result.dub = {
                source: scene.dub.source,
                volume: scene.dub.volume,
                mute: scene.dub.mute || false,
            }
        }
        if (scene.subtitle?.source) {
            result.subtitle = {
                source: scene.subtitle.source,
                style: scene.subtitle.style,
            }
        }
        return result as Fiber.FiberData
    }
    async parseCurrentFiberData () {
        this._playFiberNode = {
            video: {
                ...this._currentFiberNode.currentData.video,
                source: await this.parseSceneMedia(this._currentFiberNode.currentData.video.source),
            },
            subtitle: {
                source: await this.parseSceneSubtitle(this._currentFiberNode.currentData.subtitle?.source || ""),
                style: this._currentFiberNode.currentData.subtitle?.style || {},
            },
            dub: {
                ...this._currentFiberNode.currentData.dub,
                source: await this.parseSceneMedia(this._currentFiberNode.currentData?.dub?.source || ""),
                volume: this._currentFiberNode.currentData?.dub?.volume || 100, 
            },
        }
    }
    public async updateNextNode() {
        if (!this._currentFiberNode.next) return false
        this._currentFiberNode = this._currentFiberNode.next
        await this.parseCurrentFiberData()
        return true
    }
    async parseBackgroundAudio() {
        this._backgroundAudios = []
        const bgAudio = this._movieData.backgroundAudios
        for (let i = 0; i< bgAudio.length; i++) {
            const { source, volume, mute, loop, startTime, endTime,} = bgAudio[i]
            const blobData = this._cache.get(source)
            let url = ""
            try {
                if (blobData) {
                    url = setUrlCache(this._urlsCache, source, blobData)
                }else {
                    const bgBlob = await loadMediaSource(source)
                    setFileCache<Blob>(this._cache, source, bgBlob)
                    url = setUrlCache(this._urlsCache, source, bgBlob)
                }
                this._backgroundAudios.push({
                    source: url,
                    volume,
                    mute: mute || false,
                    loop: loop || false,
                    startTime,
                    endTime,
                })
            } catch (error) {
                console.error("加载背景音乐失败:", error)
            }
        }
    }

    async parseSceneMedia(source: string) {
        const url = this._urlsCache.get(source)
        if (url) {
            return url
        } else {
            try {
                const bgBlob = await loadMediaSource(source)
                setFileCache<Blob>(this._cache, source, bgBlob)
                return setUrlCache(this._urlsCache, source, bgBlob)
            }catch(error) {
                console.error("加载场景音视频资源失败:", error)
                return ""
            }
        }
    }

    async parseSceneSubtitle(source: string) {
        try {
            const subtitleText = await (await fetch(source)).text()
            const parse = new srtParse()
            return parse.fromSrt(subtitleText)
        } catch (error) {
            console.error("解析字幕文件失败:", error)
            return []
        }
    }
}

export default Compile
