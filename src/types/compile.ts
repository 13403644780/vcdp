import Konva from "konva"
import { Data } from "./core"

/**
 * 链表节点
 */
export interface ListNode {
  currentData: NodeData,
  next: ListNode | null
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
  }
  subtitle: {
    source: string
    style: Konva.TextConfig | any
    position: Position
  }
}

export interface Audio {
    source: string
    volume: number
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
}
export interface RenderDataSubtitle {
  source: string | any[]
  style: Konva.TextConfig | any
  position: Position
}
export interface RenderData {
  video?: RenderDataVideo
  subtitle?: RenderDataSubtitle
}


export interface CompileOptions extends Data {
  firstDataInit():void
}