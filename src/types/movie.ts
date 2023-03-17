import { CompileConfig } from "../types"
export namespace Movie {
  export interface Options {
    container: HTMLDivElement
    width: number
    height: number
    videoWidth: number
    videoHeight: number
    loadingImage: string
    subtitleStyle: CompileConfig.TextStyle
    updateNextNode: () => void
  }
  export interface VideoEvents {
    eventName: string
    callbacks: (() => void)[]
  }
  export interface VideoOptions {
    source: string
    startTime: number
    endTime: number
    volume: number
    mute: boolean
  }
}
