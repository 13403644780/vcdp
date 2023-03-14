
export namespace Movie {
  export interface Options {
    container: HTMLDivElement
    width: number
    height: number
    videoWidth: number
    videoHeight: number
  }
  export interface VideoEvents {
    eventName: string
    callbacks: (() => void)[]
  }
}
