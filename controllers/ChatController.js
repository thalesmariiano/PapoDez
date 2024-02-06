import ChatModel from '../models/ChatModel.js'

const ChatController = {
	getAll: async (req, res) => {
		try{
			const chats = await ChatModel.find()
			if(chats){
				res.status(200).json(chats)
				return
			}
			res.status(404).json({message: 'Nenhum chat foi encontrado.'})
		}catch(error){
			console.log(error)
		}	
	},
	get: async (room) => {
		try{
			const chat = await ChatModel.findOne({_id: room})
			if(chat) return chat
		}catch(error){
			console.log(error)
		}
	},
	joinUser: async (room, user) => {
		try{
			const chat = await ChatModel.findOne({_id: room})	
			if(chat){
				await ChatModel.findOneAndUpdate(
					{ _id: room },
					{ $push: {
							users_online: user
						}
					},
					{new: true}
				).then(res => {
				})
				.catch(err => console.log(err))
			}
		}catch(error){
			console.log(error)
		}
	},
	exitUser: async (room, user) => {
		try{
			const chat = await ChatModel.findOne({_id: room})	
			if(chat){
				await ChatModel.findOneAndUpdate(
					{ _id: room },
					{ $pull: {
							users_online: user
						}
					},
					{new: true}
				).then(res => {
				})
				.catch(err => console.log(err))
			}
		}catch(error){
			console.log(error)
		}
	}
}

export default ChatController