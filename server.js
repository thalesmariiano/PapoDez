import express from 'express'
import http from "http"
import { Server } from 'Socket.io'

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 3072

var userName;

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

const users_online = []

const chats = [
	{
		id: 'chat-1',
		name: 'Bate-Papo',
		users_online: []
	},
	{
		id: 'chat-2',
		name: 'Papo dos cria',
		users_online: []

	},
]

const chatNSP = io.of('/chat')

chatNSP.on('connection', (socket) => {
	socket.emit('connected', chats)
	users_online.push({
		id: socket.id,
		room: '',
	})
	chatNSP.emit('users-online', users_online)

	socket.on('enter-chat', ({chatId, chat_id}) => {
		const user = users_online[users_online.findIndex(user => user.id == socket.id)]
		if(user.room !== chatId){
			socket.join(chatId)
			socket.leave(chat_id)
			user.room = chatId

			socket.emit('chat-info', chats.find(chat => chat.id == chatId))
		}
	})

	// socket.on('user-config', user => {
	// 	user.name = userName
	// 	users_online.push(user)
	// 	chatNSP.emit('users-online', users_online)
	// })

	socket.on('chat-msg', msg => {
		const user = users_online[users_online.findIndex(user => user.id == socket.id)]
		socket.to(user.room).emit('chat-msg', msg)
	})

	socket.on('disconnect', () => {
		const user = findUser(socket.id)
		removeUser(user)

		chatNSP.emit('users-online', users_online)
	})

})

server.listen(port, () => {
	console.log(`App iniciado na porta ${port}`)
})