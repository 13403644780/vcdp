import Konva from "konva"
import { Data, } from "./core"
import { parseSubtitle, } from "./renderer"

/**
 * 链表节点
 */
export interface ListNode {
  currentData: NodeData,
  next: ListNode | undefined
}

/**
 * 节点数据
 */
export interface NodeData {
  video: {
    source: string
    startTime: number
    endTime: number
    duration: number
    volume: number
    mute: boolean
  }
  subtitle: {
    source: string
    style: {
      [key: string]: any
    }
    position: Position
  }
  dubAudio?: RenderDataAudio
}

export interface TextElement {
  text: string
  style: {
    fontFamily: string,
    fontSize: number,
    fontStyle: "italic bold" | "italic" | "bold" | "normal",
    align: "center" | "left" | "right",
    stroke: string,
    strokeWidth: number,
  },
  position: Position
}

export interface Position{
    x: number
    y: number
}
export interface RenderDataVideo {
  source: string | Blob
  startTime: number
  endTime: number
  duration: number
  volume: number
  mute: boolean
}
export interface RenderDataSubtitle {
  source: string | parseSubtitle[]
  style: Konva.TextConfig | any
  position: Position
}
export interface RenderDataAudio {
  source: string
  startTime: number
  endTime: number
  volume: number
  mute: boolean
  repeat?: boolean
}
export interface RenderData {
  video?: RenderDataVideo
  subtitle?: RenderDataSubtitle
  audio?: RenderDataAudio[],
  head?: boolean
  last?: boolean
}
export interface CompileOptions extends Data {
  firstDataInit():void
}
