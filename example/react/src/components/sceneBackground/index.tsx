import React, { useEffect, useRef, useState, } from "react"
import { Button, } from "antd"
import JSONEditor from "jsoneditor"
import { SceneBgProps, } from "../../types"
export default function (props: SceneBgProps) {
    const jsonContainer = useRef<HTMLDivElement>(null)
    const [ target, setTarget, ] = useState<JSONEditor>()
    useEffect(() => {
        const t = new JSONEditor(jsonContainer.current as HTMLDivElement, {})
        t.set(props.data)
        setTarget(t)
    }, [])
    return (
        <div className="sceneContainer">
            <Button type="primary" onClick={() => props.update(target?.get())}>更新视频背景</Button>
            <div className="jsonContainer" ref={jsonContainer}></div>
        </div>
    )
}
