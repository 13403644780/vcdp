import { Fiber, } from "../types"
export class FiberFactory {
  next: FiberFactory | undefined
  currentData: Fiber.FiberData
  head: boolean
  last: boolean
  constructor(options: Fiber.FiberData, head?: boolean, last?: boolean) {
    this.next = undefined
    this.head = head || false
    this.last = last || false
    this.currentData = options
  }
}

export const getCurrentTimeSubtitleText = (videoCurrentTime: number, videoStartTime: number, subtitles: Fiber.SubtitleSource[]) => {
  const realTime = videoCurrentTime - videoStartTime
  return subtitles.find((subtitle) => subtitle.startSeconds < realTime && subtitle.endSeconds > realTime)
}

export const calculationBackgroundStartTime = (
  previousTime: number,
  currentVideoDuration: number,
  currentAudioStartTime: number,
  currentAudioEndTime: number,
  isRepeat?: boolean): {
    startTime: number,
    endTime: number
  } => {
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

export const loadMediaSource = async (source: string) => (await fetch(source)).blob()

export const setFileCache = <T>(target: Map<string, T>, key: string, value: T) => {
  if (!target.get(key)) {
    target.set(key, value)
  }
}

export const setUrlCache = (target: Map<string, string>, key: string, value: Blob) => {
  const result = target.get(key)
  if (result) return result
  const url = URL.createObjectURL(value)
  target.set(key, url)
  return url
}
