import React, { useRef, useState, useEffect, } from "react"
import "./index.less"
import { Button, } from "@chakra-ui/react"
import JSONEditor from "jsoneditor"
import type { ElementProps, } from "../../types"
const Element: React.FC<ElementProps> = (props: ElementProps) => {
    const jsonContainer = useRef<HTMLDivElement>(null)
    const [target, setTarget,] = useState<JSONEditor>()
    useEffect(() => {
        const t = new JSONEditor(jsonContainer.current as HTMLDivElement, {})
        t.set(props.data)
        setTarget(t)
    }, [])
    return (
        <div className="elementContainer">
            <Button colorScheme='teal' variant='solid' onClick={() => props.update(target?.get())}>
                update Element
            </Button>
            <div className="jsonContainer" ref={jsonContainer}></div>
        </div>
    )
}

export default Element
