import ChatController from './controllers/ChatController.js'

export default async function(socket, chatNSP){
	const request = socket.request.session

	if(!request.user){
		socket.emit('redirect', '/')
		return
	}

	socket.on('enter-room', room => socket.join(room))
	socket.on('exit-room', room => socket.leave(room))

	chatNSP.adapter.on('join-room', async (room, socketId) => {
		const chat = await ChatController.get(room)
		if(chat){
			await ChatController.joinUser(room, socketId)
			socket.emit('chat-info', chat)			
		}
	})
		
	chatNSP.adapter.on('leave-room', async (room, socketId) => {
		const chat = await ChatController.get(room)
		if(chat){
			await ChatController.exitUser(room, socketId)
			// socket.to(room).emit('users-online', c.users_online.length)			
		}
	})

	socket.on('chat-msg', msg => {
		msg.nick = request.user.name
		socket.to(msg.room).emit('chat-msg', msg)
	})
}
