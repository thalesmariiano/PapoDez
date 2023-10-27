const express = require('express')
const app = express()
const port = 3072

const http = require("http")
const server = http.createServer(app)
const { Server } = require('Socket.io')
const io = new Server(server)

var userName;
const users_online = []

const findUser = userId => users_online.findIndex(user => user.id == userId)
const removeUser = userId => users_online.splice(userId, 1)

app.use("/static", express.static('public/arquivos'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/public/chat.html')
	userName = req.query.name ? req.query.name : `anonimo${Math.floor(Math.random() * 100)}`
})

const chatNamespace = io.of('/chat')

chatNamespace.on('connection', (socket) => {
	// socket.join('room1')
	console.log(socket)

	socket.emit('start-config', socket.id)

	socket.on('user-config', user => {
		user.name = userName
		users_online.push(user)
		chatNamespace.emit('users-online', users_online)
	})

	socket.on('chat-msg', msg => {
		socket.broadcast.emit('chat-msg', msg)
	})

	socket.on('disconnect', () => {
		const user = findUser(socket.id)
		removeUser(user)

		chatNamespace.emit('users-online', users_online)
	})

})

server.listen(port, () => {
	console.log(`App iniciado na porta ${port}`)
})