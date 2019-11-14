import Action from "./action"

function stickers(state = [] as any[], action: Action): any[] {
    switch (action.type) {
        case 'ADD':
            return [
                ...state,
            ]
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

export default stickers