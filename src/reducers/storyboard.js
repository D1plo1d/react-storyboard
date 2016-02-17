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
    //   panelIDs: [String, String]
    // }
  },
}

let generateUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random()*16|0
    let v = c === 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
}

let storyBoard = function(state = initialState, action) {
  switch (action.type) {
  case 'MOVE_PANEL':
    let {x, y, width, height} = action
    state = Object.assign({}, state)
    state.panels = Object.assign({}, state.panels)
    state.panels[action.id] = {x, y, width, height}
    state.pendingChanges = true
    return state
  case 'WEBSOCKET_CONFIG_UPDATE':
    state = Object.assign({}, state, action.state)
    state.initialized = true
    state.saveInterval = setInterval(() => store.dispatch({type: "SAVE"}), 500)
    return state
  case 'ADD_CONNECTION':
  case 'UPDATE_CONNECTION':
    let {panelIDs} = action
    state = Object.assign({}, state)
    state.connections = Object.assign({}, state.connections)
    state.connections[action.id || generateUUID()] = {panelIDs}
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
