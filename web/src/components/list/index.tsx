import ImageList from "./image-list"
import React from "react"
import { useSelector } from "react-redux"
import { StateType } from "../../store"

const List: React.FC = () => {
    const stickes = useSelector((state: StateType) => state.stickers)
    return <ImageList items={stickes} />
}

export default List;