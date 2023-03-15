import { CompileConfig, } from "./compile"
export namespace Fiber {
  export interface FiberData {
    video: CompileConfig.Video
    subtitle: Subtitle
    dub: CompileConfig.Dub
  }
  type Subtitle = Omit<CompileConfig.Subtitle, "source"> & {
    source: SubtitleSource[]
  }
  export interface SubtitleSource {
    id : string
    startTime: string
    endTime: string
    startSeconds: number
    endSeconds: number
    text: string
  }
}
