import mysql from 'mysql2/promise'
import dontenv from 'dotenv'
dontenv.config()

export default mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DATABASE,
	password: process.env.DB_PASSWORD
}) 