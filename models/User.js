import md5 from 'md5'
import connection from '../connection.js'

export default function(){

	async function login(user){
		const SQL_user = 'SELECT name FROM `users` WHERE `name` = ' + `"${user.nickname}"` 
		const nameQuery = await connection.execute(SQL_user)

		if(nameQuery[0].length){
			const SQL_full = 'SELECT * FROM `users` WHERE `name` = ' + `"${user.nickname}"` + 'AND `password` = ' + `"${md5(user.password)}"`
			const fullQuery = await connection.execute(SQL_full)

			if(fullQuery[0].length){
				return {
					data: fullQuery[0],
					log: {message: 'Logado com sucesso', url: '/chat'}
				}
			}else{
				return {error: true, message: 'Usuario/senha incorretos.'}
			}

		}else{
			return {error: true, message: 'Usuário não existe.'}
		}
	}

	return {
		login
	}
}