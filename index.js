const express = require('express')
const app = express()
const port = 3072

app.use("/static", express.static('public/arquivos'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, () => {
	console.log(`App iniciado na porta ${port}`)
})