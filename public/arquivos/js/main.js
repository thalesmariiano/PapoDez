import { showUI, removeUI } from './animation.js'

const socket = io('/chat')

const form = document.querySelector('form')
const input = document.querySelector('[name=user-msg]')
const chatContainer = document.querySelector('#chat-container')

const usersCount = document.querySelector('#users-count')
const meContainer = document.querySelector('#me-container')
const chatsList = document.querySelector('#chats-list')

const sideMenu = document.querySelector('#side-menu')
const openSideMenu = document.querySelector('#open-side-menu')
const closeSideMenu = document.querySelector('#close-side-menu')

openSideMenu.addEventListener('click', () => {
	showUI(sideMenu, 'animate__fadeInRight')
})

closeSideMenu.addEventListener('click', () => {
	removeUI(sideMenu, 'animate__fadeOutRight')
})

let chat_id = ''

socket.on('connected', chats => {
	chats.forEach(chat => {
		const li = document.createElement('li')
		const divContainer = document.createElement('div')
		divContainer.classList.add('chat', 'chat-default')
		divContainer.dataset.chat = chat.id

		divContainer.innerHTML = `
			<div class="flex items-center">
				<div class="flex items-center">
					<img class="mr-2" src="/static/images/icons/chat-dots.svg"/>
					<p class="text-zinc-300">${chat.name}</p>
				</div>
				<!-- <small class="text-neutral-400 ml-1">- ${chat.users_online.length} online</small> -->
			</div>
			<!-- <button>
				<img src="static/images/icons/three-dots-vertical.svg"/>
			</button> -->
		`

		divContainer.addEventListener('click', () => enterChat(chat.id))

		li.appendChild(divContainer)
		chatsList.appendChild(li)
	})
})

function enterChat(chatId){
	if(chat_id !== chatId){
		socket.emit('enter-chat', {chatId, chat_id})
		chat_id = chatId

		document.querySelectorAll('.chat').forEach(element => {
			if(element.dataset.chat == `${chatId}`){
				element.classList.add('chat-active')
				element.classList.remove('chat-default')
			}else{
				element.classList.remove('chat-active')
				element.classList.add('chat-default')
			}
		})
	}
}

socket.on('chat-info', info => {
	document.querySelector('#chat-name').innerHTML = info.name
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
})

// 	usersList.innerHTML = ' '
// 	users.forEach(u => {
// 		if(user.id !== u.id){
// 			const userName = u.name ? u.name : u.id
// 			usersList.innerHTML += `
// 				<li class="text-zinc-300 px-2 py-1">
// 					<span class="text-zinc-400">User:</span>
// 					${userName}
// 				</li>
// 			`
// 		}else{
// 			meContainer.innerHTML = `
// 			<div class="px-2 py-4 bg-green-950 border-b-2 border-green-900">
// 				<p class="text-zinc-300">
// 					<span class="text-zinc-400">Você:</span>
// 					${u.name ? u.name : u.id}
// 				</p>
// 			</div>
// 			`
// 		}
// 	})
// })

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
	chatContainer.innerHTML += `
		<div class="max-w-sm min-w-10" data-user="strange" data-msg="msg">
			<p class="text-zinc-500">Anônimo</p>
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