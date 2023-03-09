import Konva from 'konva'
import { Position } from './compile'
/**
 * 配置文件
 */
export interface Config {
  container: string | HTMLDivElement
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
  backgroundAudio?: BackgroundAudio
  scenes: Scene[]
  elements: VideoElement[]
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
  mute?: boolean,
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
  type: 1 | 2,
  text?: string
  source: string
  position: Position
  style: Konva.TextConfig | Konva.ImageConfig
  startAppear: number
  endAppear: number
}

/**
 * 配音
 */
export interface Dub {
  source: string
  startTime: number
  endTime: number
  volume: number
  mute: boolean
}

/**
 * 字幕
 */
export interface Subtitle {
  source: string
  style: Konva.TextConfig
  position: Position
}

/**
 * 素材
 * @type { number } 1: 视频素材 2: 图片素材
 */
export interface Material {
  type: 1 | 2
  duration: number
  startTime: number
  endTime: number
  source: string
}

