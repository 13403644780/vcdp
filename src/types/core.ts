import { CompileConfig, } from "./compile"
import { Movie, } from "./movie"
export namespace CoreConfig {
  export type Options = Omit<Movie.Options, "container" | "loadingImage" | "width" | "height" | "subtitleStyle" | "updateNextNode" | "loadingImage" | "pauseImage" | "replayImage"> & {
    movieData: CompileConfig.MovieData,
    container: string | HTMLDivElement
    loadingImage?: string
    pauseImage?: string
    replayImage?: string
  }
}
