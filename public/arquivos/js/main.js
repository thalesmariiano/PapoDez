
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
		const data = new Date()
		const horas = data.getHours()
		const minutos = data.getMinutes()

		const msg = {
			mensagem: input.value,
			hora_enviada: `${horas}:${minutos}`
		}

		if(socket.emit('chat-msg', msg)){
			chatContainer.innerHTML += `
				<div class="max-w-sm min-w-10 self-end" data-user="you" data-msg="msg">
					<p class="text-zinc-500 text-right">Você - <small class="text-zinc-600">${msg.hora_enviada}</small></p>
					<div class="p-1 my-1 rounded bg-green-800">
						<p class="text-white">${msg.mensagem}</p>
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
			<p class="text-zinc-500"><small class="text-zinc-600">${msg.hora_enviada}</small> - Estranho</p>
			<div class="p-1 my-1 rounded bg-red-800">
				<p class="text-white">${msg.mensagem}</p>
			</div>
		</div>
	`
})