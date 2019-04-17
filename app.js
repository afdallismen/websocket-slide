require('dotenv').config()

const path = require('path')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use('/', express.static(path.join(__dirname, 'public')))

const key = process.env.SECRET_KEY

let currentState

io.on('connection', function (socket) {
  io.emit('secret', key)
  console.log(currentState)
  if (currentState) {
    socket.emit('init-state', currentState)
  }
  socket.on('slide-changed', function (state) {
    currentState = state
    socket.broadcast.emit('slide-changed', state)
  })
})

http.listen(3000, _ => {
  console.log('Listening on port 3000...')
})