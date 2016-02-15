import { createStore } from 'redux'
import io from 'socket.io-client'

let socket = io("127.0.0.1:8098")
let store

let initialState = {
  initialized: false,
  pendingChanges: false,
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
  },
}

let storyBoard = function(state = initialState, action) {
  switch (action.type) {
  case 'MOVE_PANEL':
    let {x, y} = action
    let state = Object.assign({}, state)
    state.panels = Object.assign({}, state.panels)
    state.panels[action.id] = {x, y}
    state.pendingChanges = true
    return state
  case 'WEBSOCKET_CONFIG_UPDATE':
    state = Object.assign({}, state, action.state)
    state.initialized = true
    state.saveInterval = setInterval(() => store.dispatch({type: "SAVE"}), 500)
    return state
  case 'SAVE':
    let {panels, connections} = state
    if (state.pendingChanges) {
      socket.emit("config update", {panels, connections})
      state.pendingChanges = false
    }
    return state
  default:
    return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
store = createStore(storyBoard)
export default store

socket.on("config update", (state) =>
  store.dispatch({type: "WEBSOCKET_CONFIG_UPDATE", state})
)
