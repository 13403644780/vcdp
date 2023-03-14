import { Howl, } from "howler"

export namespace Audio {
  export interface Result {
    source: string
    volume: number
    startTime: number
    endTime: number
    mute: boolean
    loop: boolean
  }
  export interface Group {
    howl: Howl,
    howlId: number
  }
}
