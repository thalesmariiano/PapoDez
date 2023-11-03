const form = document.querySelector('#login-form')
const nameInput = document.querySelector('#name-input')
const passwordInput = document.querySelector('#password-input')
const errorText = document.querySelector('#form-error')

const validator = () => {
	const regex = /^\s*$/
	const errors = []
	var listenersAdded = false

	const isEmpty = input => {
		if(regex.test(input.value)){
			if(!errors.find(err => err === input.name)){
				errors.push(input.name)
			}
		}else{
			errors.forEach((err, index) => {
				if(err == input.name){
					errors.splice(index, 1)
				}
			})
		}
	}

	const showErrors = () => {
		errors.forEach(errName => {
			const errInput = document.querySelector(`[name=${errName}]`)
			errInput.classList.add('border', 'border-red-500')
			errorText.innerHTML = 'Preencha todos os campos!'
			errorText.classList.remove('hidden')

			if(!listenersAdded){
				errInput.addEventListener('input', () => {
					errInput.classList.remove('border', 'border-red-500')
				})
			}
		})
	}

	return {
		isEmpty,
		showErrors,
		errors,
		listenersAdded
	}
}

const validar = validator()

form.addEventListener('submit', e => {
	e.preventDefault()

	validar.isEmpty(nameInput)
	validar.isEmpty(passwordInput)
	validar.showErrors()
	validar.listenersAdded = true

	if(!validar.errors.length){
		errorText.classList.add('hidden')

		fetch('http://localhost:3072/login', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams(new FormData(form))
		}).then(response => response.json())
		.then(data => {
			if(!data.error){
				if(data.url){
					window.location.replace(data.url)
				}
			}else{
				errorText.innerHTML = data.message
				errorText.classList.remove('hidden')
			}
		})
		.catch(err => {
			console.error('Erro: ' + err)
		})
	}
})