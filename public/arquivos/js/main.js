
const socket = io()

const form = document.querySelector('form')
const input = document.querySelector('[name=user-msg]')

form.addEventListener('submit', event => {
	event.preventDefault()
	
	if(input.value){
		socket.emit('chat-msg', input.value)
		input.value = ''
	}
})

socket.on('chat-msg', msg => {
	console.log("messagem: " + msg)
})