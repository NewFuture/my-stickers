import { Avatar } from "@stardust-ui/react"
import React from "react"

const avatar = {
    image: 'https://avatars1.githubusercontent.com/u/6290356?s=64',
    status: { color: 'green', icon: 'check' },
}

const gutter = <Avatar {...avatar} />

export default gutter;