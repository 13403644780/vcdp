import React, { useEffect, useRef, useState, } from "react"
import "./scene.less"
import { Button, } from "antd"
import JSONEditor from "jsoneditor"
import { SceneProps, } from "../types"
export default function (props: SceneProps) {
    const jsonContainer = useRef<HTMLDivElement>(null)
    const [ target, setTarget, ] = useState<JSONEditor>()
    useEffect(() => {
        const t = new JSONEditor(jsonContainer.current as HTMLDivElement, {})
        t.set(props.data)
        setTarget(t)
    }, [])
    return (
        <div className="sceneContainer">
            <Button type="primary" onClick={() => props.update(target?.get())}>更新场景</Button>
            <div className="jsonContainer" ref={jsonContainer}></div>
        </div>
    )
}
