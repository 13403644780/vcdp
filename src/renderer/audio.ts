import { AudioConfig, } from "../types"
import { Howl, } from "howler"
export class AudioRender {
    _audioGroup: AudioConfig.Group[]
    _audios: AudioConfig.Result[]
    constructor(audios: AudioConfig.Result[]) {
        this._audioGroup = []
        this._audios = audios
        this.initPlayer()
    }
    initPlayer() {
        this.dispose()
        this._audioGroup = this._audios.map(item => {
            return {
                howl: new Howl({
                    src: item.source,
                    volume: item.volume / 100,
                    mute: item.mute,
                    loop: item.loop,
                    format: "mp3",
                    sprite: {
                        main: [item.startTime, item.endTime - item.startTime,],
                    },
                }),
                howlId: 0,
            }
        })
    }
    public play() {
        for (let i = 0; i < this._audioGroup.length; i++) {
            if (this._audioGroup[i].howlId === 0) {
                this._audioGroup[i].howlId = this._audioGroup[i].howl.play("main")
            } else {
                this._audioGroup[i].howl.play(this._audioGroup[i].howlId)
            }
        }
    }
    public pause() {
        for (let i = 0; i < this._audioGroup.length; i++) {
            if (this._audioGroup[i].howlId === 0) {
                this._audioGroup[i].howl.pause()
            } else {
                this._audioGroup[i].howl.pause(this._audioGroup[i].howlId)
            }
        }
    }
    public stop() {
        for (let i = 0; i < this._audioGroup.length; i++) {
            const howlId = this._audioGroup[i].howlId
            const isPlaying = this._audioGroup[i].howl.playing(howlId)
            if (isPlaying) {
                this._audioGroup[i].howl.stop(howlId)
            }
        }
    }
    public dispose() {
        for (let i = 0; i< this._audioGroup.length; i++) {
            this._audioGroup[i].howl.unload()
            this._audioGroup[i].howlId = 0
        }
        this._audioGroup = []
    }
}
