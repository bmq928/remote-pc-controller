const http = require('http')
const express = require('express')
const execa = require('execa')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const PORT = 3000
const STATIC_FILE_PATH = path.join(__dirname, 'public')

app.use(express.static(STATIC_FILE_PATH))
app.get('/', (req, res) => {
  const indexHtml = path.join(STATIC_FILE_PATH, 'index.html')
  res.sendFile(indexHtml)
})

io.on('connection', socket => {
  socket.on('hello-from-browser', msg => {
    console.log('Socket is connected')
    socket.emit('hello-from-server', 'Hello from server')
  })
})

server.listen(PORT, () => console.log(`Server is started in port:${PORT}`))
