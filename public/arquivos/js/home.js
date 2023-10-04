
const enterChat = document.querySelector('#enter-chat-button')

const dialogContainer = document.querySelector('#dialog-container')
const userNick = document.querySelector('#user-nick')
const closeDialog = document.querySelector('#close-dialog-button')
const doneButton = document.querySelector('#done-button')

enterChat.addEventListener('click', () => {
	dialogContainer.classList.remove('hidden')
})

