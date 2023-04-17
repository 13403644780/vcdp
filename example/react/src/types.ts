import { CompileConfig, } from "@happyPlayer"
export interface Props {
    Scene: React.FC<SceneProps>
    BgAudio: React.FC<BgAudioProps>
    SceneBg: React.FC<SceneBgProps>
    Broadcast: React.FC<BroadcastProps>
    Element: React.FC<ElementProps>
    SceneData: CompileConfig.Scene[]
    BgAudioData: CompileConfig.BackgroundAudio[]
    SceneBgData: CompileConfig.SceneBackground
    ElementData: CompileConfig.VideoElement[]
    updateScene: (scene: CompileConfig.Scene[]) => void
    updateSceneBgAudio: (scene: CompileConfig.BackgroundAudio[]) => void
    updateSceneBackground: (scene: CompileConfig.SceneBackground) => void
    updateElement: (elements: CompileConfig.VideoElement[]) => void
    play: () => void
    pause: () => void
    replay: () => void
}

export interface SceneProps {
    data: CompileConfig.Scene[]
    update: (scene: CompileConfig.Scene[]) => void
}
export interface BgAudioProps {
    data: CompileConfig.BackgroundAudio[]
    update: (bgAudio: CompileConfig.BackgroundAudio[]) => void
}
export interface SceneBgProps {
    data: CompileConfig.SceneBackground
    update: (bgAudio: CompileConfig.SceneBackground) => void
}
export interface DubProps {
    data: CompileConfig.Dub
    update: (bgAudio: CompileConfig.Dub) => void
}

export interface BroadcastProps {
    play: () => void
    pause: () => void
    replay: () => void
}

export interface ElementProps {
    data: CompileConfig.VideoElement[]
    update: (bgAudio: CompileConfig.VideoElement[]) => void
}
