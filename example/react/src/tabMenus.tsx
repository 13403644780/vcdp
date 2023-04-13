import React from "react"
import type { TabsProps, } from "antd"
import { Tabs, } from "antd"
import Scene from "./components/Scene"

export default function Tab() {
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "场景",
            children: <Scene />,
        },
    ]
    return <Tabs
        size="small"
        items={items}
        defaultActiveKey="1"
    />
}
