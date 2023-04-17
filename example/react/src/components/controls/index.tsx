import React from "react"
import "./broadcast.less"
import { Button, Stack, } from "@chakra-ui/react"
import { BroadcastProps, } from "../../types"
export default function (props: BroadcastProps) {

    return (
        <div className="broadcastContainer">
            <Stack direction='row' spacing={4} align='center'>

                <Button colorScheme='teal' variant='ghost' onClick={props.play}>
                    Play
                </Button>
                <Button colorScheme='teal' variant='ghost' onClick={props.pause}>
                    Pause
                </Button>
                <Button colorScheme='teal' variant='ghost' onClick={props.replay}>
                    Replay
                </Button>

            </Stack>
        </div>
    )
}
