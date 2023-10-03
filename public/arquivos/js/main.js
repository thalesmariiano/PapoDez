
const socket = io()

const form = document.querySelector('form')
const input = document.querySelector('[name=user-msg]')
const chatContainer = document.querySelector('#chat-container')

const usersList = document.querySelector('#users-list')

const user = {
	id: null,
	name: prompt('Qual o seu nome?')
}

socket.on('connect', () => {
	// chatContainer.innerHTML += `
	// 	<div class="w-full text-center">
	// 		<p class="text-zinc-500 text-sm">
	// 			<span class="text-zinc-600">
	// 				Você
	// 			</span>
	// 			conectou.
	// 		</p>	
	// 	</div>
		
	// `
})

socket.on('start-config', socketId => {
	user.id = socketId
	socket.emit('user-config', user)
})

// socket.on('user-on', userId => {
// 	chatContainer.innerHTML += `
// 		<div class="w-full text-center">
// 			<p class="text-zinc-500 text-sm">Usuário
// 				<span class="text-zinc-600">
// 					${userId}
// 				</span>
// 				conectado.
// 			</p>	
// 		</div>
		
// 	`
// })

socket.on('users-online', users => {
	usersList.innerHTML = ' '

	users.forEach(user => {
		const userName = user.name ? user.name : user.id
		usersList.innerHTML += `
			<li class="text-zinc-300 px-2 py-1">
				<span class="text-zinc-400">User:</span>
				${userName}
			</li>
		`
	})
})

// socket.on('user-off', userId => {
// 	chatContainer.innerHTML += `
// 		<div class="w-full text-center">
// 			<p class="text-zinc-500 text-sm">Usuário
// 				<span class="text-zinc-600">
// 					${userId}
// 				</span>
// 				desconectado.
// 			</p>
// 		</div>
		
// 	`
// })

form.addEventListener('submit', event => {
	event.preventDefault()
	
	if(input.value){
		const date = new Date()
		const hours = date.getHours()
		const minutes = date.getMinutes()

		const msg = {
			user,
			message: input.value,
			time: `${hours}:${minutes}`
		}

		if(socket.emit('chat-msg', msg)){
			chatContainer.innerHTML += `
				<div class="max-w-sm min-w-10 self-end" data-user="you" data-msg="msg">
					<p class="text-zinc-500 text-right">Você - <small class="text-zinc-600">${msg.time}</small></p>
					<div class="p-1 my-1 rounded bg-green-800">
						<p class="text-white">${msg.message}</p>
					</div>
				</div>
			`
			input.value = ''
		}
	}
})

socket.on('chat-msg', msg => {
	chatContainer.innerHTML += `
		<div class="max-w-sm min-w-10" data-user="strange" data-msg="msg">
			<p class="text-zinc-500"><small class="text-zinc-600">${msg.time}</small> - ${msg.user.name}</p>
			<div class="p-1 my-1 rounded bg-red-800">
				<p class="text-white">${msg.message}</p>
			</div>
		</div>
	`
})