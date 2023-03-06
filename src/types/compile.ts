/**
 * 链表节点
 */
export interface ListNode {
  currentData: NodeData,
  sourceIndex: number | null
  next: ListNode | null
}

/**
 * 节点数据
 */
export interface NodeData {
  audio?: Audio[],
  scene: {
    source: string
    volume: number
    duration: number
    startTime: number
    endTime: number
    position: {
      x: number
      y: number
    },
    size: {
      width: number
      height: number
    },
    subtitle: {}
  },
  elements?: Element[]
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
  position: {
    x: number
    y: number
  }
}