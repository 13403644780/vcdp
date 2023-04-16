import React from "react"
import "./broadcast.less"
import { Button, } from "antd"
import { BroadcastProps, } from "../types"
export default function (props: BroadcastProps) {

    return (
        <div className="broadcastContainer">
            <Button type="primary" onClick={props.play}>播放</Button>
            <Button type="primary" onClick={props.pause}>暂停</Button>
            <Button type="primary" onClick={props.replay}>重播</Button>
        </div>
    )
}
