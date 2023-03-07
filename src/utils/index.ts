import { ListNode, NodeData } from "../types/compile";
export class ListNodeFactory {
  next: ListNode | null
  currentData: NodeData
  constructor(options: NodeData) {
    this.next = null
    this.currentData = options
  }
}


export function calculateBackgroundAudioTime(duration: number, currentTime: number, currentDuration: number, preTime: number) {

}