function get(url, callback, headers = {}){
	var request = new XMLHttpRequest();

	request.addEventListener("readystatechange", () => { 
		if (request.readyState == 4 && request.status == 200)
			callback(request.responseText);
	});

	request.open("GET", url, true);

	if (headers) {
		for (header in headers){
			request.setRequestHeader(header, headers[header]);
		}
	}

	request.send();
}

function post(url, callback, headers = {}){
	var request = new XMLHttpRequest();

	request.addEventListener("readystatechange", () => { 
		if (request.readyState == 4 && request.status == 200)
			callback(request.responseText);
	});

	request.open("POST", url, true);

	if (headers) {
		for (header in headers){
			request.setRequestHeader(header, headers[header]);
		}
	}

	request.send();
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
