import React from "react"
import "./broadcast.less"
import { Button, Stack, } from "@chakra-ui/react"
import { BroadcastProps, } from "../../types"
import { Pause, Play, Replay, } from "../icons"
export default function (props: BroadcastProps) {
    
    return (
        <div className="broadcastContainer">
            <Stack direction='row' spacing={4} align='center'>

                <Button leftIcon={<Play />} colorScheme='teal' variant='solid' onClick={props.play}>
                    Play
                </Button>
                <Button leftIcon={<Pause />} colorScheme='teal' variant='solid' onClick={props.pause}>
                    Pause
                </Button>
                <Button leftIcon={<Replay />} colorScheme='teal' variant='solid' onClick={props.replay}>
                    Replay
                </Button>

            </Stack>
        </div>
    )
}
