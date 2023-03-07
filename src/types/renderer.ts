import { VideoConfig } from "./core"

/**
 * 初始化
 */
export interface RendererConfig {
  container: HTMLDivElement,
  video: VideoConfig
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