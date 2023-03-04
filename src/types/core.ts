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
export interface BackgroundAudio {}

/**
 * 场景
 */
export interface Scene {}

/**
 * 视频元素
 */
export interface VideoElement {}