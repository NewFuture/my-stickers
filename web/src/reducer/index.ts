import { combineReducers } from 'redux'
import stickers from './stickers'
import status from './status'

export default combineReducers({
    stickers,
    status
})