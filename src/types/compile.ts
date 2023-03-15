import Konva from "konva"
export namespace CompileConfig {
  export interface Options extends MovieData {
    firstCompileCallback: () => void
  }
  export interface MovieData {
    backgroundAudios: BackgroundAudio[]
    scenes: Scene[]
    elements: Element[]
  }
  interface BackgroundAudio {
    source: string
    startTime: number
    endTime: number
    volume: number
    mute?: boolean
    loop?: boolean
  }
  export interface Scene {
    duration: number
    video: Video
    subtitle?: Subtitle
    dub?: Dub
  }
  export interface Subtitle {
    source: string
    style: TextStyle
  }
  export interface Video {
    source: string
    startTime: number
    endTime: number
    volume: number
    mute?: boolean
  }

  export type Dub = Omit<BackgroundAudio, "startTime" | "endTime" | "loop"> 
  type TextStyle = Konva.TextConfig & {
    [prop: string] : string | number
  }
}
