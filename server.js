
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import db_connection from './db/connection.js'

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

import chat from './chat.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const sessionMiddleware = session({
	secret: 'teste',
	resave: false,
	saveUninitialized: true
})
app.use(sessionMiddleware)
io.engine.use(sessionMiddleware)

app.use(cors({
	origin: true,
	credentials: true
}))

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

app.post('/login', (req, res) => UserController.auth(req, res))

const chatNSP = io.of('/chat')
chatNSP.on('connection', socket => chat(socket, chatNSP))

server.listen(process.env.PORT, () => {
	console.log(`App iniciado na porta: ${process.env.PORT}`)
	db_connection()
})