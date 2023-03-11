import { ListNode, NodeData, } from "../types/compile"
import { parseSubtitle, } from "../types"
export class ListNodeFactory {
    next: ListNode | null
    currentData: NodeData
    constructor(options: NodeData) {
        this.next = null
        this.currentData = options
    }
}

export const getCurrentTimeSubtitleText = (videoCurrentTime: number, videoStartTime: number, subtitles: parseSubtitle[])=> {
    const realTime = videoCurrentTime - videoStartTime
    return subtitles.find((subtitle) => subtitle.startSeconds < realTime && subtitle.endSeconds > realTime)
}

export const  calculationBackgroundStartTime = (
    previousTime: number,
    currentVideoDuration: number,
    currentAudioStartTime: number,
    currentAudioEndTime: number,
    isRepeat?: boolean): {
    startTime: number,
    endTime: number
  }  => {
    const backgroundAudioDuration = currentAudioEndTime - currentAudioStartTime
    const startTime = backgroundAudioDuration > previousTime ? 
        currentAudioStartTime + previousTime : 
        isRepeat ?
            currentAudioStartTime + previousTime % backgroundAudioDuration :
            -1
    const endTime = startTime === -1 ?
        -1 :
        startTime + currentVideoDuration > backgroundAudioDuration ?
            backgroundAudioDuration - (startTime + currentVideoDuration) + currentAudioStartTime :
            startTime + currentVideoDuration
    return {
        startTime,
        endTime,
    }
}

