import { createStore } from 'redux'
import io from 'socket.io-client'

let socket = io("127.0.0.1:8098")

let initialState = {
  meta: {initialized: false}
  panels: {
    // {
    //   x: Number
    //   y: Number
    // }
  },
  connections: {
    // {
    //   panelIds: [String, String]
    // }
  }
}

let storyBoard = function(state = initialState, action) {
  switch (action.type) {
  case 'MOVE_PANEL':
    let {x, y} = action
    let state = Object.assign({}, state)
    state.panels = Object.assign({}, state.panels)[action.id] = {x, y}
    return state
  case 'WEBSOCKET_CONFIG_UPDATE':
    return Object.assign({}, state, action.state)
  case 'SAVE':
    let {panels, connections} = state
    socket.emit({panels, connections})
    return state
  default:
    return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(storyBoard)
export default store

socket.on("config update", (state) =>
  store.dispatch({type: "WEBSOCKET_CONFIG_UPDATE", state})
)
