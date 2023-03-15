import { Howl, } from "howler"

export namespace AudioConfig {
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
