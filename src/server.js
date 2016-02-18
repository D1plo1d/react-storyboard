/* eslint-disable no-console */
var Server = require("socket.io")
var fs  = require("fs")
var http = require("http")
var process = require("process")
var path = require("path")
var yaml = require('js-yaml')

var configPath = process.env["STORYBOARD_PATH"]
configPath = configPath || path.join(process.cwd(), "config", "storyboard.yml")

var sendConfigDataTo = function(socket) {
  fs.readFile(configPath, (err, data) => {
    if (err) {
      console.log("Error: Unable to read config file")
      data = ""
    }
    socket.emit("config update",  yaml.safeLoad(data))
  })
}

var saveConfigData = function(data) {
  fs.writeFile(configPath, yaml.safeDump(data))
}

var httpServer = http.createServer(function(req,res){
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200)
    res.end()
    return
  }
})
var io = Server(httpServer)

io.on('connection', function(socket) {
  // On connection send the config data to the new websocket
  sendConfigDataTo(socket)
  // Listen for the websocket to send config changedTouches
  socket.on("config update", function(data) { saveConfigData(data)})
})

var watchConfigFile = function() {
  // On config change update the socket connections
  fs.watch(configPath, function() { sendConfigDataTo(io)})
}

try {
  watchConfigFile()
} catch(e) {
  fs.writeFile(configPath, "", function(err) {
    if (err) throw err
    watchConfigFile()
  })
}

httpServer.listen(8098, "127.0.0.1")
