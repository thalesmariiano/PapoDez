import express from 'express'
import http from "http"
import bodyParser from 'body-parser'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'Socket.io'

// import connection from './connection.js'

// const getMessagens = msgsCount => {
// 	connection.query(
// 		'SELECT * FROM `bate-papo-geral` LIMIT ' + msgsCount,
// 		(err, results, fields) => {
// 			console.log(results)
// 		}
// 	)
// }

// // getMessagens(1)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 3072

const findUser = userId => users_online.findIndex(user => user.id == userId)
const removeUser = userId => users_online.splice(userId, 1)

const chatNSP = io.of('/chat')
const users_online = []

const user = {
	id: '',
	nick: '',
	room: '',
}

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

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use("/static", express.static('public/arquivos'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.get('/chat', (req, res) => {
	if(!user.nick || user.nick == ' ') res.redirect('/')

	res.sendFile(__dirname + '/public/chat.html')
})

app.post('/', (req, res) => {
	const { nickname } = req.body
	user.nick = nickname ? nickname : `Anônimo${Math.floor(Math.random() * 100)}`
	res.redirect('/chat')
})

chatNSP.on('connection', (socket) => {
	user.id = socket.id

	socket.emit('send-chats', chats)
	socket.emit('send-user', user)
	users_online.push(user)

	socket.on('enter-chat', chat => {
		const userToEnter = users_online[users_online.findIndex(u => u.id == socket.id)]
		userToEnter.room = chat.toEnter
		console.log(userToEnter)
		socket.join(chat.toEnter)
		socket.leave(chat.toLeave)

		socket.emit('chat-info', chats.find(chat => chat.id == chat.toEnter))
	})

	// socket.on('user-config', user => {
	// 	user.name = userName
	// 	users_online.push(user)
	// 	chatNSP.emit('users-online', users_online)
	// })

	socket.on('chat-msg', msg => {
		const userr = users_online[users_online.findIndex(userr => userr.id == socket.id)]
		socket.to(userr.room).emit('chat-msg', msg)
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