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

const users_online = []

const findUser = userId => users_online.findIndex(user => user.id == userId)
const removeUser = userId => users_online.splice(userId, 1)

io.on('connection', socket => {
	socket.join('sala-1')

	socket.emit('start-config', socket.id)

	socket.on('user-config', user => {
		users_online.push(user)
		io.emit('users-online', users_online)
	})

	socket.on('chat-msg', msg => {
		socket.broadcast.emit('chat-msg', msg)
	})

	socket.on('disconnect', () => {
		const user = findUser(socket.id)
		removeUser(user)

		socket.broadcast.emit('users-online', users_online)
	})

})

server.listen(port, () => {
	console.log(`App iniciado na porta ${port}`)
})