import { getUserSession, setUserSession } from '../../assets/helpers/storage.js'
import { API_URL } from '../../constants.js'

const user = getUserSession()
const dropArea = document.getElementById('dropArea')
const inputFile = document.getElementById('inputImage')
let userName = user?.name
let userEmail = user?.email
let userID = user?.id
let picture

//Show user information
function showUserInfo() {
	if (user) {
		document.getElementById('name').setAttribute('value', user?.name)
		document.getElementById('email').setAttribute('value', user?.email)
	} else {
		myProfile.style.display = 'none'
		deleteAccount.style.display = 'none'
	}
}

showUserInfo()

// Change user information
saveProfileInfoBtn.addEventListener('click', (e) => {
	e.preventDefault()
	userName = document.getElementById('name').value
	userEmail = document.getElementById('email').value
	user.name = userName
	user.email = userEmail

	saveUserInfo()
	saveProfilePicture()
})

// Save user information
async function saveUserInfo() {
	try {
		const name = document.getElementById('name').value

		const response = await fetch(`${API_URL}/user?id=${userID}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
			}),
		})
		const result = await response.json()
		setUserSession(user)
		console.log('user name updated succesfully', result)
	} catch (error) {
		console.log('user name error', error)
	}
}

// Change password
function togglePwModal() {
	const pwModal = resetPwPopup.style
	pwModal.display = pwModal.display === 'block' ? 'none' : 'block'
}

resetPwBtn.addEventListener('click', togglePwModal)
resetPwSaveBtn.addEventListener('click', togglePwModal)
resetPwCanelBtn.addEventListener('click', togglePwModal)

// Profile photo
function showProfilePic(url = '#') {
	profilePhoto.setAttribute('src', url)
}

showProfilePic(user?.photo)

inputFile.addEventListener('change', loadImage)

function loadImage() {
	picture = inputFile.files[0]
	showProfilePic()
}

dropArea.addEventListener('dragover', (e) => {
	e.preventDefault()
})

dropArea.addEventListener('drop', (e) => {
	e.preventDefault()

	inputFile.files = e.dataTransfer.files
	loadImage()
})

async function saveProfilePicture() {
	try {
		const response = await fetch(`${API_URL}/user-image?userId=${userID}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				picture,
			}),
		})
		const result = await response.json()
		console.log('picture upload success', result)
		// TODO: get image url from API response and set it to user?.photo
	} catch (error) {
		console.log('picture upload error', error)
	}
}

// Delete profile
function toggleDelModal() {
	const delModal = deleteAccountConfirm.style
	delModal.display = delModal.display === 'block' ? 'none' : 'block'
}

deleteAccountBtn.addEventListener('click', toggleDelModal)

deleteAccountNoBtn.addEventListener('click', toggleDelModal)

// Update settings
// Check permission status
if ('Notification' in window) {
	navigator.permissions
		.query({ name: 'notifications' })
		.then((notificationPermissionStatus) => {
			if (notificationPermissionStatus.state !== 'granted') {
				const permissionStatus = document.getElementById('permissionStatus')
				const pElement = document.createElement('p')
				pElement.textContent = 'Push Notification permissions are not granted'
				permissionStatus.appendChild(pElement)
			}
		})
} else {
	console.log('Push notifications are not supported in this browser.')
}

if ('geolocation' in navigator) {
	navigator.permissions
		.query({ name: 'geolocation' })
		.then((geolocationPermissionStatus) => {
			if (geolocationPermissionStatus.state !== 'granted') {
				const permissionStatus = document.getElementById('permissionStatus')
				const pElement = document.createElement('p')
				pElement.textContent = 'Geolocation permissions are not granted'
				permissionStatus.appendChild(pElement)
			}
		})
} else {
	console.log('Geolocation is not supported in this browser.')
}

// Check status of push notification setting
async function getNotificationSettings() {
	const response = await fetch(`${API_URL}/notification?user_id=${userID}`)
	const result = await response.json()
	let status = result.data.is_enabled

	if (status) {
		pushNotificationSwitch.checked = true
	} else {
		pushNotificationSwitch.checked = false
	}
}

getNotificationSettings()

// Toggle push notification setting
async function setNotificationSettings() {
	let state
	if (pushNotificationSwitch.checked) {
		state = true
	} else {
		state = false
	}
	console.log(state)

	try {
		const response = await fetch(`${API_URL}/notification?user_id=${userID}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				is_enabled: state,
			}),
		})

		const result = await response.json()
		console.log('Notifications turned on', result)
	} catch (error) {
		console.log('Notifications turned off', error)
	}
}

pushNotificationSwitch.addEventListener('change', setNotificationSettings)
