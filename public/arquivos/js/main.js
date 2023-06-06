
const socket = io()

const form = document.querySelector('form')
const input = document.querySelector('[name=user-msg]')
const chatContainer = document.querySelector('#chat-container')

socket.on('connect', () => {
	chatContainer.innerHTML += `
		<div class="w-full text-center">
			<p class="text-zinc-500 text-sm">
				<span class="text-zinc-600">
					Você
				</span>
				conectou.
			</p>	
		</div>
		
	`
})

socket.on('user-on', userId => {
	chatContainer.innerHTML += `
		<div class="w-full text-center">
			<p class="text-zinc-500 text-sm">Usuário
				<span class="text-zinc-600">
					${userId}
				</span>
				conectado.
			</p>	
		</div>
		
	`
})

socket.on('user-off', userId => {
	chatContainer.innerHTML += `
		<div class="w-full text-center">
			<p class="text-zinc-500 text-sm">Usuário
				<span class="text-zinc-600">
					${userId}
				</span>
				desconectado.
			</p>
		</div>
		
	`
})

form.addEventListener('submit', event => {
	event.preventDefault()
	
	if(input.value){
		if(socket.emit('chat-msg', input.value)){
			chatContainer.innerHTML += `
				<div class="relative w-96 self-end">
					<p class="text-zinc-500 text-right">Você</p>
					<div class="p-1 my-1 rounded bg-green-800">
						<p class="text-white">${input.value}</p>
					</div>
				</div>
			`
			input.value = ''
		}
	}
})

socket.on('chat-msg', msg => {
	chatContainer.innerHTML += `
		<div class="w-96">
			<p class="text-zinc-500">Estranho</p>
			<div class="p-1 my-1 rounded bg-red-800">
				<p class="text-white">${msg}</p>
			</div>
		</div>
	`
})