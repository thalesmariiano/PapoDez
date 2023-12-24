import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import http from "http"
import bodyParser from 'body-parser'
import session from 'express-session'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'

import isAuthenticated from './middlewares/auth.js'
import UserController from './controllers/UserController.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const chatNSP = io.of('/chat')

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



const sessionMiddleware = session({
	secret: 'teste',
	resave: false,
	saveUninitialized: true
})

app.use(cors({
	origin: '*',
	credentials: true,
	optionSuccessStatus:200,
}))
app.use(sessionMiddleware)
io.engine.use(sessionMiddleware)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use("/static", express.static('public/arquivos'))

app.get('/', (req, res) => {
	if(req.session.user){
		res.redirect('/chat')
		return
	}

	res.sendFile(__dirname + '/public/index.html')
})

app.get('/chat', isAuthenticated, (req, res) => {
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
		res.status(401).json(loginResquest)
	}
})

chatNSP.on('connection', (socket) => {
	const request = socket.request.session

	if(!request.user){
		socket.emit('redirect', '/')
		return
	}

	socket.emit('send-chats', chats)

	socket.on('enter-room', chatId => {
		socket.join(chatId)

		const chat = chats.find(chat => chat.id === chatId)
		if(chat){
			chat.users_online.push(socket.id)
			socket.emit('chat-info', chat)
		}
	})
	socket.on('exit-room', chatId => {
		socket.leave(chatId)

		const chat = chats.find(chat => chat.id === chatId)
		if(chat){
			const socketIndex = chat.users_online.findIndex(userSocket => userSocket === socket.id)
			chat.users_online.splice(socketIndex, 1)
		}
	})

	chatNSP.adapter.on('join-room', (room, socketId) => {
		const chat = chats.find(chat => chat.id === room)
		socket.to(room).emit('chat-info', chat)
	})
	
	chatNSP.adapter.on('leave-room', (room, socketId) => {
		const chat = chats.find(chat => chat.id === room)
		socket.to(room).emit('chat-info', chat)
	})

	socket.on('chat-msg', msg => {
		msg.nick = request.user[0].name
		socket.to(msg.room).emit('chat-msg', msg)
	})
})

server.listen(process.env.PORT, () => {
	console.log(`App iniciado`)
})