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

		const data = {
			nickname: document.querySelector('[name="nickname"]').value,
			password: document.querySelector('[name="password"]').value
		}

		axios.post('http://localhost:21062/login', data)
		.then(({data}) => {
			if(data.log.url){
				window.location.replace(data.log.url)
			}
		})
		.catch(({response}) => {
			errorText.innerHTML = response.data.message
			errorText.classList.remove('hidden')
		})
	}
})