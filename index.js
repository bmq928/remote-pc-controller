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
    socket.emit('hello-from-server', 'Hello from server')
  })

  socket.on('tap', msg => {
    console.log(msg)
    const cliSendMsg = {
      keys: [msg.key],
    }
    execa.command(
      `python keyboard.py --tap --data ${JSON.stringify(cliSendMsg)}`
    )
  })

  socket.on('exec', msg => {
    console.log(msg)
    const cliSendMsg = {
      keys: msg.typedBtns
    }
    execa.command(
      `python keyboard.py --execution --data ${JSON.stringify(cliSendMsg)}`
    )
  })
})

server.listen(PORT, () => console.log(`Server is started in port:${PORT}`))
