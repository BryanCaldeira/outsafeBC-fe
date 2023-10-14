//Show user information
import { getUserSession, setUserSession } from '../../assets/helpers/storage.js'
import { API_URL } from '../../constants.js'

const user = getUserSession()

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
let userName = user?.name
let userEmail = user?.email
let userID = user?.id

saveProfileInfoBtn.addEventListener('click', (e) => {
	e.preventDefault()
	userName = document.getElementById('name').value
	userEmail = document.getElementById('email').value
	user.name = userName
	user.email = userEmail
	setUserSession(user)
	// showProfilePic()
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
		console.log('user name updated succesfully', result)
	} catch (error) {
		console.log('user name error', error)
	}
}

// Change password
function togglePwModal() {
	const pwModal = changePwPopup.style
	pwModal.display = pwModal.display === 'block' ? 'none' : 'block'
}

changePwBtn.addEventListener('click', togglePwModal)

changePwSaveBtn.addEventListener('click', togglePwModal)

// Profile photo
function showProfilePic() {
	if (user && user.photo) {
		profilePhoto.setAttribute('src', user?.photo)
	} else {
		profilePhoto.setAttribute('src', '#')
	}
}

showProfilePic()

const dropArea = document.getElementById('dropArea')
const inputFile = document.getElementById('inputImage')
var picture

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
		// get image url from API response and set it to user?.photo
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

// Check status of push notification setting

async function getNotificationSettings (){
	const response = await fetch(`${API_URL}/notification?user_id=${userID}`)
	const result = await response.json()
	let status = result.data.is_enabled

	if (status) {
		pushNotificationSwitch.checked = true
	} else {
		pushNotificationSwitch.checked = false
	}

}

getNotificationSettings ()

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
