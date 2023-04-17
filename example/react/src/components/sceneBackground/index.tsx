import React, { useEffect, useRef, useState, } from "react"
import { Button, } from "@chakra-ui/react"
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
            <Button colorScheme='teal' variant='solid' onClick={() => props.update(target?.get())}>Update Scene Background</Button>
            <div className="jsonContainer" ref={jsonContainer}></div>
        </div>
    )
}
