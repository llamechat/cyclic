const http = require("http");

let server = http.createServer((request, response) => {
	console.log(`${time()} | request from ${request.socket.address().address}`);

	let path = request.url.split("/").filter(str => str.length != 0);

	response.writeHead(200, { "Content-Type": "text/html" });
	response.end("Hello, World!");
});

server.on("listening", () => {
	console.log("cyclic launched!");
	console.log(`listening at port ${server.address().port} of ${server.address().address}`);
	console.log("---");
});

server.listen(80);

function time() {
	let d = new Date();
	return `${d.getHours() + 1}:${d.getMinutes() + 1}:${d.getSeconds() + 1}`
}
