type Action =
    {
        type: "ADD",
        payload: {}
    } | {
        type: "DELETE",
        payload: {
            id: string
        }
    }
export default Action