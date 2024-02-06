import UserModel from '../models/UserModel.js'

const UserController = {
	auth: async (req, res) => {
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
				res.status(200).json({user, message: 'Logado com sucesso'})
			})
		})
	}
}

export default UserController