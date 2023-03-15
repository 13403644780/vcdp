import { CompileConfig, } from "./compile"
import { Movie, } from "./movie"
export namespace CoreConfig {
  export type Options = Omit<Movie.Options, "container" | "loadingImage" | "width" | "height"> & {
    movieData: CompileConfig.MovieData,
    container: string | HTMLDivElement
    loadingImage?: string
  }
}
