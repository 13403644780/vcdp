import { VideoConfig, } from "./core"

/**
 * 初始化
 */
export interface RendererConfig {
  container: HTMLDivElement
  video: VideoConfig
  other?: {
    loadingImage?: string
    background?: string
  }
  callbacks: {
    [prop: string]: () => void
  }
}

/**
 * 字幕解析内容
 */
export interface parseSubtitle {
  endSeconds: number
  endTime: string
  id: string
  startSeconds: number
  startTime: string
  text: string
}
