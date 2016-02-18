import { createStore } from 'redux'
import io from 'socket.io-client'

let socket = io("127.0.0.1:8098")
let store

let initialState = {
  initialized: false,
  pendingChanges: false,
  panels: {
    // [id]: {
    //   id: String
    //   x: Number
    //   y: Number
    // }
  },
  connections: {
    // [id]: {
    //   id: String
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
  let id
  switch (action.type) {
  case 'MOVE_PANEL':
    let {x, y, width, height} = action
    id = action.id
    state = Object.assign({}, state)
    state.panels = Object.assign({}, state.panels)
    state.panels[id] = {id, x, y, width, height}
    state.pendingChanges = true
    return state
  case 'WEBSOCKET_CONFIG_UPDATE':
    let nextStateHash = JSON.stringify(action.state)
    if (state.savedStateHash === nextStateHash) return state
    state = Object.assign({}, state, action.state)
    state.savedStateHash = nextStateHash
    state.initialized = true
    state.saveInterval = setInterval(() => store.dispatch({type: "SAVE"}), 500)
    return state
  case 'ADD_CONNECTION':
  case 'UPDATE_CONNECTION':
    let {panelIDs} = action
    id = action.id || generateUUID()
    state = Object.assign({}, state)
    state.connections = Object.assign({}, state.connections)
    state.connections[id] = {id, panelIDs}
    // remove duplicate connections
    let nextConnections = {}
    let panelIDSort = (a, b) => a.localeCompare(b)
    let connectionPanelHashes = Object.values(state.connections).map(
      ({panelIDs}) => JSON.stringify(panelIDs.sort(panelIDSort))
    )
    Object.values(state.connections).forEach((connection, i) => {
      panelIDs = connection.panelIDs.sort(panelIDSort)
      if (connectionPanelHashes.indexOf(JSON.stringify(panelIDs)) === i) {
        nextConnections[connection.id] = connection
      }
    })
    state.connections = nextConnections
    // trigger a save next interval
    state.pendingChanges = true
    return state
    case 'DELETE_CONNECTION':
      state = Object.assign({}, state)
      state.connections = Object.assign({}, state.connections)
      delete state.connections[action.id]
      return state
  case 'SAVE':
    let state = Object.assign({}, state)
    let {panels} = state
    let connections = {}
    Object.values(state.connections).forEach((connection) => {
      if (connection.panelIDs.length === 2) {
        connections[connection.id] = connection
      }
    })
    if (state.pendingChanges) {
      let packet = {panels, connections}
      state.savedStateHash = JSON.stringify(packet)
      socket.emit("config update", packet)
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
