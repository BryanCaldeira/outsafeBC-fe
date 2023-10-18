import { API_URL, GOOGLE_ID } from '../../constants.js'
//Helpers
import { getUserSession, setUserSession } from '../../assets/helpers/storage.js'
//Components
import AlertPopup from '../../assets/components/AlertPopup.js'
//Variables
const alert = new AlertPopup()

/**
 * Google Auth Setup
 */
window.onload = function () {
	const user = getUserSession()

	if (!!user?.id) {
		window.location.replace('/')
	}

	google.accounts.id.initialize({
		client_id: GOOGLE_ID,
		callback: async (googleResponse) => {
			try {
				const response = await fetch(`${API_URL}/auth?provider=google`, {
					method: 'POST',
					body: JSON.stringify(googleResponse),
				})

				const { data } = await response.json()

				if (data?.id) {
					alert.show('Welcome back!')
					setUserSession(data)
					window.location.replace('/')
					return
				}

				alert.show(AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error)
			} catch (error) {
				alert.show(AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error)
				console.debug(error)
			}
		},
		use_fedcm_for_prompt: true,
	})
	google.accounts.id.renderButton(document.getElementById('google-button'), {
		theme: 'outline',
		size: 'large',
	})
	google.accounts.id.prompt()
}

/**
 * Login Submit
 */
document
	.getElementById('login-form')
	.addEventListener('submit', async (event) => {
		event.preventDefault()

		try {
			const email = document.getElementById('email-input').value
			const password = document.getElementById('password-input').value

			const response = await fetch(`${API_URL}/auth`, {
				method: 'POST',
				body: JSON.stringify({
					email,
					password,
				}),
			})

			const { data, error } = await response.json()

			if (data?.id) {
				alert.show('Welcome back!')

				setUserSession(data)
				window.location.replace('/')
			}

			if (!!error) {
				alert.show(error, AlertPopup.error)
			}
		} catch (error) {
			alert.show(AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error)
			console.debug(error)
		}
	})
