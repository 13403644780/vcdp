import React, { useEffect, useRef, useState, } from "react"
import JSONEditor from "jsoneditor"
import "./App.css"
import "jsoneditor/dist/jsoneditor.min.css"
import jsonData from "./mock/01.json"
import loadingImage from "../assets/loading.svg"
import { Core, Data, } from "@happyPlayer"

const App = () => {
    const jsonViewRef = useRef<HTMLDivElement>(null)
    const playerContainer = useRef<HTMLDivElement>(null)
    const [ jsonControl, setJsonControl, ] = useState<JSONEditor>()
    const [playerRef, setPlayerRef,] = useState<Core>()
    useEffect(() => {
        const jsonView = new JSONEditor(jsonViewRef.current as HTMLDivElement, {})
        setJsonControl(jsonView)
        jsonView.set(jsonData)
    }, [])
    useEffect(() => {
        const player = new Core({
            container: playerContainer.current as HTMLDivElement,
            video: {
                width: 1920,
                height: 1080,
            },
            data: jsonData as Data,
            other: {
                loadingImage: loadingImage,
            },
        })
        setPlayerRef(player)
    }, [])
    const updatePlayer = () => {
        console.log("jsonControl.get(): ", jsonControl?.get())
    }
    const play = () => {
        playerRef?.play()
    }
    const pause = () => {
        playerRef?.pause()
    }
    return (
        <div className="container">
            <div className='topView'>
                <div className='data'>
                    <div className='buttonGroup'>
                        <button onClick={updatePlayer}>更新</button>
                        <button onClick={play}>播放</button>
                        <button onClick={pause}>暂停</button>
                    </div>
                    <div className='jsonContainer' ref={jsonViewRef}></div>
                </div>
                <div className='player' ref={playerContainer}></div>
            </div>
            <div className='bottomView'></div>
        </div>
    )
}

export default App
