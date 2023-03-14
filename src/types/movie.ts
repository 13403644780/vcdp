
export namespace Movie {
  export interface Options {
    container: HTMLDivElement
    width: number
    height: number
    videoWidth: number
    videoHeight: number,
    loadingImage: string
  }
  export interface VideoEvents {
    eventName: string
    callbacks: (() => void)[]
  }
}
