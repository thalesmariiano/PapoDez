import ChatModel from './models/ChatModel.js'

export default async function(socket, chatNSP){
	const request = socket.request.session

	if(!request.user){
		socket.emit('redirect', '/')
		return
	}

	const chats = await ChatModel.find({})
	if(!chats) return

	socket.emit('send-chats', chats)		

	socket.on('enter-room', async chatId => {
		socket.join(chatId)

			// const chat = await ChatModel.find({_id: chatId})	
			// if(chat){
			// 	await ChatModel.findOneAndUpdate(
			// 		{ _id: chatId },
			// 		{ $push: {users_online: socket.id}},
			// 		{new: true}
			// 	).then(res => {
			// 		socket.emit('chat-info', res)
			// 	})
			// 	.catch(err => console.log(err))
			// }
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
}
