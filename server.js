
import mongoose from 'mongoose'
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

import UserModel from './schemas/userSchema.js'


// const newUser = new UserModel({
// 	name: 'Thales Mariano',
// 	username: 'thalesmariiano',
// 	email: 'thales.mariano125@gmail.com',
// 	password: 'thales123'
// })

// newUser.save()
// 	.then(res => {
// 		console.log(res)
// 	})
// 	.catch(err => {
// 		console.log(err)
// 	})


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
	origin: true,
	credentials: true
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

	const userExist = await UserModel.findOne({username: req.body.nickname})
	if(!userExist){
		return res.status(401).json({message: 'Usuário não existe.'})
	}

	const user = await UserModel.findOne({username: req.body.nickname, password: req.body.password})
	if(!user){
		return res.status(401).json({message: 'Senha incorreta.'})
	}

	req.session.regenerate(err => {
		if(err) next()

		req.session.user = user

		req.session.save(function(err){
		if(err) return next(err)
			res.status(200).json({
				data: user,
				log: {message: 'Logado com sucesso', url: '/chat'}
			})
		})
	})

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
		msg.nick = request.user.name
		socket.to(msg.room).emit('chat-msg', msg)
	})
})

server.listen(process.env.PORT, () => {
	console.log(`App iniciado na porta: ${process.env.PORT}`)

	mongoose.set('strictQuery', true);
		mongoose.connect(process.env.DB_URI).then(() => {
		console.log('A conexão com o banco de dados foi estabelecida!');
	});
})