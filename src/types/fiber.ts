import { CompileConfig, } from "./compile"
export namespace Fiber {
  export interface FiberData {
    video: CompileConfig.Video
    subtitle?: CompileConfig.Subtitle
    dub?: CompileConfig.Dub
  }
  export type PlayFiberNode = Omit<FiberData, "subtitle"> & {
    subtitle: Subtitle
  }
  export type Subtitle = Omit<CompileConfig.Subtitle, "source"> & {
    source: SubtitleSource[]
  }
  export interface SubtitleSource {
    id: string
    startTime: string
    endTime: string
    startSeconds: number
    endSeconds: number
    text: string
  }
}
