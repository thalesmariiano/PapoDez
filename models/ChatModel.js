import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	users_online: {
		type: [String],
		required: true,
	},
	max_users: {
		type: Number,
		required: true
	}
})

export default mongoose.model('chats', chatSchema)
