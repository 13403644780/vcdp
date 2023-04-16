import React from "react"
import type { TabsProps, } from "antd"
import { Tabs, } from "antd"
import "./tab.less"
import type { Props, } from "./types"
export default function Tab(props: Props) {
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "场景",
            children: <props.Scene data={props.SceneData} update={props.updateScene} />,
        },
        {
            key: "2",
            label: "背景音乐",
            children: <props.BgAudio data={props.BgAudioData} update={props.updateSceneBgAudio} />,
        },
        {
            key: "4",
            label: "视频背景",
            children: <props.SceneBg data={props.SceneBgData} update={props.updateSceneBackground}/>,
        },
        {
            key: "5",
            label: "播控",
            children: <props.Broadcast pause={props.pause} play={props.play} replay={props.replay}/>,
        },
    ]
    return <Tabs
        size="small"
        items={items}
        defaultActiveKey="1"
    />
}
