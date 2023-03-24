import { CompileConfig } from "./compile"
import { Fiber } from "./fiber"

export namespace Render {
    export interface Options {
        container: HTMLDivElement
        videoWidth: number
        videoHeight: number
        loadingImage: string
        pauseImage: string
        replayImage: string
        subtitleStyle: CompileConfig.TextStyle,
        updateNextNode: () => void
    }
}
