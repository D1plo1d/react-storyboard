import Server from "socket.io"
import fs  from "fs"
import http from "http"
import process from "process"

let configPath = ENV["STORYBOARD_PATH"]
configPath = configPath || path.join(process.cwd(), "config", "storyboard.yml")

let sendConfigDataTo = (socket) => {
  fs.readFile(configPath, (err, data) => {
    if (err) throw err
    socket.emit("config update", data)
  })
}

let saveConfigData = (data) => {
  fs.writeFile(configPath, data)
}

let httpServer = http.createServer()
let io = Server(httpServer)

io.on('connection', (socket) => {
  // On connection send the config data to the new websocket
  sendConfigDataTo(socket)
  // Listen for the websocket to send config changedTouches
  socket.on("config update", (data) => saveConfigData(data))
})

// On config change update the socket connections
fs.watch(configPath, () => sendConfigDataTo(io))

httpServer.listen(8098, "127.0.0.1")
