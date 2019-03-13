const http = require("http");
const util = require("./src/lib/util");
const config = require("./config.json");

let server = http.createServer((request, response) => {
	let address =
		request.rawHeaders.includes("DNT") ?
			"anon" : request.socket.address().address;

	console.log(`${time()} | request from ${address}`);

	let path = request.url.split("/").filter(str => str.length != 0);

	util.getPage(path, request).then((data) => {
		response.writeHead(data.code, { "Content-Type": data.type, "Connection": "close" });
		response.end(data.content);

		console.log(`${time()} | responed with a ${data.code}`);
	}).catch((e) => response.end(e));
});

server.on("listening", () => {
	console.log("cyclic launched!");
	console.log(`listening at port ${server.address().port} of ${server.address().address}`);
	console.log("---");
});

server.listen(config.port);

function time() {
	let d = new Date();
	return `${d.getHours() + 1}:${d.getMinutes() + 1}:${d.getSeconds() + 1}`
}
