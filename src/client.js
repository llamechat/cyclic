let loginPanel = document.getElementById("login-panel");
let usernameField = document.getElementById("username");
let passwordField = document.getElementById("password");
let loginButton = document.getElementById("login");

let channelPanel = document.getElementById("channel-view");
let logoutButton = document.getElementById("logout");
let channelField = document.getElementById("channel");
let messageField = document.getElementById("message");
let sendButton = document.getElementById("send");
let display = document.getElementById("display");

usernameField.value = "";
passwordField.value = "";
channelField.value = "";
messageField.value = "";

let account;

if (localStorage.account) {
	account = JSON.parse(localStorage.account);
}

loginButton.addEventListener("click", () => {
	post("/api/accounts/authenticate/", {
		username: usernameField.value,
		password: passwordField.value,
	}).then((d) => {
		let data = JSON.parse(d);

		if (data.error)
			throw data;

		account = {
			username: usernameField.value,
			password: passwordField.value,
		}

		localStorage.account = JSON.stringify(account);

		updatePanels();
	}).catch(console.error);
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

(function getMessages() {
	let c = () => setTimeout(getMessages, 2000);

	if (account) get(`/api/channels/${channelField.value}/read/`).then((d) => {
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
	if (account) loginPanel.style.display = "none";
	if (!account) channelPanel.style.display = "none";
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
