import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export default function(){
	try {
		mongoose.set('strictQuery', true);
			mongoose.connect(process.env.DB_URI).then(() => {
			console.log('Conexão com o banco de dados estabelecida.')
		});
	}catch(err){
		console.log(err)
	}
}
