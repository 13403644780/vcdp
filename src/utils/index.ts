import { ListNode, NodeData } from "../types/compile";
export class ListNodeFactory {
  next: ListNode | null
  currentData: NodeData
  constructor(options: ListNode) {
    this.next = null
    this.currentData = options.currentData
  }
}