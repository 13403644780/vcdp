import Konva from 'konva'
/**
 * 配置文件
 */
export interface Config {
  container: string | Element
  video: VideoConfig
  data: Data
}

/**
 * 视频参数
 */
export interface VideoConfig {
  width: number
  height: number
}
/**
 * 内容参数
 */
export interface Data {
  backgroundAudio: BackgroundAudio[]
  scenes: Scene[]
  element: VideoElement[]
}

/**
 * 背景音乐
 */
export interface BackgroundAudio {
  duration: number
  source: string
  startTime: number
  endTime: number
  repeat?: boolean
  mute?: boolean
  volume: number
}

/**
 * 场景
 */
export interface Scene {
  duration: number
  volume: number
  dub?: Dub
  subtitle?: Subtitle
  material: Material
}

/**
 * 视频元素
 * 1: 文字元素
 * 2: 图片元素
 */
export interface VideoElement {
  type: 1 | 2
}

/**
 * 配音
 */
export interface Dub {
  source: string
  startTime: number
  endTime: number
  volume: number
}

/**
 * 字幕
 */
export interface Subtitle {
  source: string
  style: Konva.TextConfig
}

/**
 * 素材
 * @type { number } 1: 视频素材 2: 图片素材
 */
export interface Material {
  type: 1 | 2
  duration: number
  startTime?: number
  endTime?: number
  volume?: number
  source: string
}
