import { Tabs, TabList, TabPanels, Tab, TabPanel, } from "@chakra-ui/react"
import React from "react"
import type { Props, } from "../../types"
const TabMenus: React.FC<Props> = (props: Props) => {

    return (
        <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab>Scene</Tab>
                <Tab>Background Audio</Tab>
                <Tab>Scene Background</Tab>
                <Tab>Playback Controls</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    {<props.Scene data={props.SceneData} update={props.updateScene} />}
                </TabPanel>
                <TabPanel>
                    {<props.BgAudio data={props.BgAudioData} update={props.updateSceneBgAudio} />}
                </TabPanel>
                <TabPanel>
                    {<props.SceneBg data={props.SceneBgData} update={props.updateSceneBackground} />}
                </TabPanel>
                <TabPanel>
                    {<props.Broadcast play={props.play} pause={props.pause} replay={props.replay} />}
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default TabMenus
