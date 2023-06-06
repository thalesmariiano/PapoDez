const express = require('express')
const app = express()
const port = 3072

const http = require("http")
const server = http.createServer(app)
const { Server } = require('Socket.io')
const io = new Server(server)

app.use("/static", express.static('public/arquivos'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', socket => {
	socket.broadcast.emit('user-on', socket.id)
	socket.on('disconnect', () => {
		socket.broadcast.emit('user-off', socket.id)
	})

	socket.on('chat-msg', msg => {
		socket.broadcast.emit('chat-msg', msg)
	})
})

server.listen(port, () => {
	console.log(`App iniciado na porta ${port}`)
})