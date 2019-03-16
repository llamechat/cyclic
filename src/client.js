let registerPanel = document.getElementById("register-panel");
let registerUsernameField = document.getElementById("register-username");
let registerPasswordField = document.getElementById("register-password");
let registerButton = document.getElementById("register");

let loginPanel = document.getElementById("login-panel");
let loginUsernameField = document.getElementById("login-username");
let loginPasswordField = document.getElementById("login-password");
let loginButton = document.getElementById("login");

let channelPanel = document.getElementById("channel-view");
let logoutButton = document.getElementById("logout");
let channelField = document.getElementById("channel");
let messageField = document.getElementById("message");
let sendButton = document.getElementById("send");
let display = document.getElementById("display");

let account;

{ // init controls
	registerUsernameField.value = "";
	registerPasswordField.value = "";
	loginUsernameField.value = "";
	loginPasswordField.value = "";
	channelField.value = "";
	messageField.value = "";
}

{ // login
	if (localStorage.account) {
		account = JSON.parse(localStorage.account);
	}

	updatePanels();
}

registerButton.addEventListener("click", () => {
	post("/api/accounts/create/", {
		username: registerUsernameField.value,
		password: registerPasswordField.value,
	}).then((d) => {
		let data = JSON.parse(d);

		if (data.error)
			throw data;

		alert(`now you can login as "${registerUsernameField.value}"`)
	}).catch(console.error);
});

loginButton.addEventListener("click", () => {
	post("/api/accounts/authenticate/", {
		username: loginUsernameField.value,
		password: loginPasswordField.value,
	}).then((d) => {
		let data = JSON.parse(d);

		if (data.error)
			throw data;

		account = {
			username: loginUsernameField.value,
			password: loginPasswordField.value,
		}

		localStorage.account = JSON.stringify(account);

		updatePanels();
	}).catch(console.error);
});

logoutButton.addEventListener("click", () => {
	account = undefined;

	localStorage.removeItem("account");

	updatePanels();
});

sendButton.addEventListener("click", () => {
	post(`/api/channels/${channelField.value}/send/`, {
		username: account.username,
		password: account.password,
		message: messageField.value,
	}).then((d) => {
		let data = JSON.parse(d);

		if (data.error)
			throw data;

		console.log(data);
	}).catch(console.error);
});

(function getMessages(login) {
	let c = () => setTimeout(getMessages, 2000);

	if (account && channelField.value.length != 0) get(`/api/channels/${channelField.value}/read/`).then((d) => {
		let data = JSON.parse(d);

		if (data.error)
			throw data;

		display.innerHTML = data.html;
	}).catch((e) => {
		console.error(e);
	});

	c();
})();

function updatePanels() {
	if (account) {
		registerPanel.classList.add("hidden");
		loginPanel.classList.add("hidden");
		channelPanel.classList.remove("hidden");
	} else {
		registerPanel.classList.remove("hidden");
		loginPanel.classList.remove("hidden");
		channelPanel.classList.add("hidden");
	}
}

function get(url){
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "GET",
		}).then((response) =>
			response.text()
				.then(resolve)
				.catch(reject))
		.catch(reject);
	});
}

function post(url, headers = {}) {
	let data = "";

	Object.keys(headers).forEach((header, i) => {
		if (i != 0)
			data += "&";

		data += `${header}=${headers[header]}`;
	});

	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "POST",
			body: data,
		}).then((response) =>
			response.text()
				.then(resolve)
				.catch(reject))
		.catch(reject);
	});
}
