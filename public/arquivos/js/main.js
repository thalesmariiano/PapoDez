
const socket = io()

const form = document.querySelector('form')
const input = document.querySelector('[name=user-msg]')
const chatContainer = document.querySelector('#chat-container')

const usersCount = document.querySelector('#users-count')
const meContainer = document.querySelector('#me-container')
const usersList = document.querySelector('#users-list')

const user = {
	id: null,
	name: ''
}

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

	usersCount.innerHTML = `${users.length} online`

	usersList.innerHTML = ' '
	users.forEach(u => {
		if(user.id !== u.id){
			const userName = u.name ? u.name : u.id
			usersList.innerHTML += `
				<li class="text-zinc-300 px-2 py-1">
					<span class="text-zinc-400">User:</span>
					${userName}
				</li>
			`
		}else{
			meContainer.innerHTML = `
			<div class="px-2 py-4 bg-green-950 border-b-2 border-green-900">
				<p class="text-zinc-300">
					<span class="text-zinc-400">Você:</span>
					${u.name ? u.name : u.id}
				</p>
			</div>
			`
		}
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
					<p class="text-zinc-500 text-right">Você</p>
					<div class="p-1 my-1 rounded bg-green-800 flex items-center gap-x-2">
						<div>
							<p class="text-white break-words text-left">${msg.message}</p>
						</div>
						<div class="self-end">
							<small class="text-neutral-300 text-[10px]">${msg.time}</small>
						</div>
					</div>
				</div>
			`
			input.value = ''

			// Scroll alinhar com mensagem mais recente
			chatContainer.scrollTo(0, chatContainer.scrollHeight)
		}
	}
})

socket.on('chat-msg', msg => {
	const userName = msg.user.name ? msg.user.name : 'Anônimo'
	chatContainer.innerHTML += `
		<div class="max-w-sm min-w-10" data-user="strange" data-msg="msg">
			<p class="text-zinc-500">${userName}</p>
			<div class="p-1 my-1 rounded bg-red-800 flex items-center gap-x-2">
				<div class="self-end">
					<small class="text-neutral-300 text-[10px]">${msg.time}</small>
				</div>
				<div>
					<p class="text-white break-words text-left">${msg.message}</p>
				</div>
			</div>
		</div>
	`

	// Scroll alinhar com mensagem mais recente
	chatContainer.scrollTo(0, chatContainer.scrollHeight)
})