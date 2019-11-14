import Action from "./action"

function status(state = "pending", action: Action): string {
    switch (action.type) {
        case 'ADD':
            return  state
        case 'DELETE':
            // return state.map(todo =>
            //     (stickers.id === action.id)
            //         ? { ...todo, completed: !todo.completed }
            //         : todo
            // )
        default:
            return state
    }
}

export default status