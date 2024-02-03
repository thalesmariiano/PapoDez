
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	name: {
		type: String
	},
	username: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		lowercase: true,
		unique: true
	},
	password: {
		type: String,
	}
})

export default mongoose.model('users', userSchema)
