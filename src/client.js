let channelField = document.getElementById("channel");
let usernameField = document.getElementById("username");
let passwordField = document.getElementById("password");
let messageField = document.getElementById("message");
let sendButton = document.getElementById("send");
let display = document.getElementById("display");

sendButton.addEventListener("click", () => {
	post(`/api/channels/${channelField.value}/send/`, {
		username: usernameField.value,
		password: passwordField.value,
		message: messageField.value,
	})
	.then((data) => {
		console.log(JSON.parse(data));
	}).catch(console.error);
});

(function getMessages() {
	let c = () => setTimeout(getMessages, 2000);

	get(`/api/channels/${channelField.value}/read/`).then((data) => {
		display.innerHTML = JSON.parse(data).html;

		c();
	}).catch((e) => {
		console.error(e);

		c();
	});
})();

function get(url){
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "GET",
		})	.then((response) =>
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
		})	.then((response) =>
				response.text()
					.then(resolve)
					.catch(reject))
			.catch(reject);
	});
}
