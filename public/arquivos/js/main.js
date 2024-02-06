import { showUI, removeUI } from './animation.js'

const socket = io('/chat')

const form = document.querySelector('form')
const input = document.querySelector('[name=user-msg]')
const chatContainer = document.querySelector('#chat-container')

const chatName = document.querySelector('#chat-name')
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

let user_chat = ''

socket.on('redirect', router => window.location.replace(router))

socket.on('send-chats', chatsInfo => {
	chatsInfo.forEach(chat => {
		const li = document.createElement('li')
		const divContainer = document.createElement('div')
		divContainer.classList.add('chat', 'chat-default')
		divContainer.dataset.chat = chat._id

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

		divContainer.addEventListener('click', () => enterChat(chat._id))

		li.appendChild(divContainer)
		chatsList.appendChild(li)
	})
})

function enterChat(chatId){
	if(user_chat) socket.emit('exit-room', user_chat)

	const chat = document.querySelector(`[data-chat='${chatId}']`)
	const classArray = Array(...chat.classList)
	
	if(!classArray.includes('chat-active')){
		socket.emit('enter-room', chatId)
		user_chat = chatId

		chat.classList.add('chat-active')
		chat.classList.remove('chat-default')

		document.querySelectorAll('.chat').forEach(element => {
			if(element.dataset.chat == chatId) return

			element.classList.remove('chat-active')
			element.classList.add('chat-default')
		})
		chatContainer.innerHTML = ''
	}
}

socket.on('chat-info', chat => {
	chatName.innerHTML = chat.name
	usersCount.innerHTML = `${chat.users_online.length} online`
})

form.addEventListener('submit', event => {
	event.preventDefault()
	
	if(input.value){
		const dateTime = new Date()

		const msg = {
			nick: '', // nick vai ser passado na session no server
			message: input.value,
			room: user_chat,
			date_time: dateTime
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
							<small class="text-neutral-300 text-[10px]">${dateTime.getHours()}:${dateTime.getMinutes()}</small>
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
	const dateTime = new Date(msg.date_time)

	chatContainer.innerHTML += `
		<div class="max-w-sm min-w-10" data-user="strange" data-msg="msg">
			<p class="text-zinc-500">${msg.nick}</p>
			<div class="p-1 my-1 rounded bg-red-800 flex items-center gap-x-2">
				<div class="self-end">
					<small class="text-neutral-300 text-[10px]">${dateTime.getHours()}:${dateTime.getMinutes()}</small>
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