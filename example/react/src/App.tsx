import React, {useEffect, useRef, useState,} from "react"
import "./index.less"
import "jsoneditor/dist/jsoneditor.min.css"
import "antd/dist/reset.css"
import data from "./mock/01.json"
import {CompileConfig, Core,} from "@happyPlayer"
import Tab from "./tabMenus"
import { log, } from "console"

const App = () => {
    const Divider = useRef<HTMLDivElement>(null)
    const TopContainer = useRef<HTMLDivElement>(null)
    const BottomContainer = useRef<HTMLDivElement>(null)
    const Player = useRef<HTMLDivElement>(null)
    const [v, setV,] = useState<Core>()
  

    useEffect(() => {
        console.log(TopContainer)
    }, [])
    const update = (data: CompileConfig.Options) => {
        v?.update(data)
    }
    const setSceneBackground = (data: CompileConfig.SceneBackground) => {
        v?.setSceneBackground(data)
    }
    const handleMouseDown = () => {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }
    const handleMouseMove = (event: { clientX: React.SetStateAction<number>; clientY: React.SetStateAction<number> }) => {
        TopContainer.current.style.height = event.clientY + "px"
    }
    
    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }
    return (
        <div className="container">
            <div className="top layoutContainer" ref={TopContainer}>
                <div className="topLeft"  
                >
                    <Tab
                        update={update}
                        setSceneBackground={setSceneBackground}
                    />
                </div>
                <div className="topDivider"></div>
                <div className="topRight">
                    <div className="player" ref={Player}></div>
                </div>
            </div>
            <div className="divider" onMouseDown={handleMouseDown} ref={Divider}/>
            <div className="button layoutContainer" ref={BottomContainer}></div>
        </div>
    )
}

export default App
