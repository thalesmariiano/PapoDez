import user from '../models/User.js'

export default function(){

	async function login(userInfo){
		return await user().login(userInfo)
	}

	return {
		login
	}
}