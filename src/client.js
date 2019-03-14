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
		display.innerText = JSON.stringify(JSON.parse(data), undefined, "\t");

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

/* thank you yamachat web client for existing so I can steal yo shit
function drawMessages(response){
	page = document.createElement( 'html' );
	page.innerHTML = response;

	messages = page.children[1].getElementsByTagName('div');
	output = '';
	for (i=0;i<messages.length;i++){
		output += "<span style='color:" + messages[i].attributes['data-colour'].value + "'>";
		output += messages[i].attributes['data-username'].value;
		output += '</span>';
		output += ': ';
		output += messages[i].innerHTML;
		output += '<br />';
	}
	document.getElementById("display").innerHTML=output;
}

function ClickedIt(){
	httpGetAsync("http://chat.yamajac.com/" + document.getElementById("channel").value + "/send/" + encodeURIComponent(document.getElementById("input").value), function(response){console.log(response);}, {"user":document.getElementById("user").value,"password":document.getElementById("password").value,"colour":document.getElementById("colour").value});
	document.getElementById("input").value = "";
}

function runLoop(){
	httpGetAsync("http://chat.yamajac.com/" + document.getElementById("channel").value + "/read", drawMessages);
	setTimeout(runLoop,2000);
}
document.getElementById("input").onkeydown = KeyPress;

function KeyPress(e){
	if(e.which == 13 && !e.shiftKey) {
		ClickedIt();
		e.preventDefault();
		return false;
	}
}
runLoop();
*/
