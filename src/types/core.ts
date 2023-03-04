/**
 * 配置文件
 */
export interface Config {
  container: string | Element
  video: {
    width: number
    height: number
  }
}

/**
 * 视频参数
 */
export interface VideoConfig {
  width: number
  height: number
}