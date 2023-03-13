import { NodeData, } from "../types/compile"
import { parseSubtitle, } from "../types"
export class ListNodeFactory {
    next: ListNodeFactory | undefined
    currentData: NodeData
    head: boolean
    last: boolean
    constructor(options: NodeData, head?: boolean, last?: boolean) {
        this.next = undefined
        this.head = head || false
        this.last = last || false
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

