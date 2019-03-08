const http = require("http");
const util = require("./src/lib/util");

let server = http.createServer((request, response) => {
	console.log(`${time()} | request from ${request.socket.address().address}`);

	let path = request.url.split("/").filter(str => str.length != 0);

	util.getPage(path).then((data) => {
		response.writeHead(200, { "Content-Type": data.type });
		response.end(data.content);
	}).catch((e) => response.end(e));
});

server.on("listening", () => {
	console.log("cyclic launched!");
	console.log(`listening at port ${server.address().port} of ${server.address().address}`);
	console.log("---");
});

server.listen(8080);

function time() {
	let d = new Date();
	return `${d.getHours() + 1}:${d.getMinutes() + 1}:${d.getSeconds() + 1}`
}
