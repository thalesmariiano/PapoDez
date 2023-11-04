import express from 'express'
import http from "http"
import bodyParser from 'body-parser'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'Socket.io'

import isAuthenticated from './middlewares/auth.js'
import UserController from './controllers/UserController.js'

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

app.use(session({
	secret: 'teste',
	resave: false,
	saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use("/static", express.static('public/arquivos'))

app.get('/', (req, res) => {
	req.session.destroy(err => {})

	res.sendFile(__dirname + '/public/index.html')
})

app.get('/chat', isAuthenticated,(req, res) => {
	res.sendFile(__dirname + '/public/chat.html')
})

app.post('/login', async (req, res) => {
	const loginResquest = await UserController().login(req.body)

	if(!loginResquest.error){
		req.session.regenerate(err => {
			if(err) next()

			req.session.user = loginResquest.data

			req.session.save(function (err) {
			if (err) return next(err)
				res.status(200).json(loginResquest.log)
			})
		})
	}else{
		res.status(200).json(loginResquest)
	}
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