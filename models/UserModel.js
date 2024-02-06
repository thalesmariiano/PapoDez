import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	name: {
		type: String
		required: true
	},
	username: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
})

export default mongoose.model('users', userSchema)
