const http = require("http");
const qs = require("querystring");
const util = require("./src/lib/util");
const config = require("./config.json");

let server = http.createServer((request, response) => {
	let data = "";

	request.on("data", (chunk) => {
		data += chunk;

		if (data > 1e6)
			request.destroy("413 Too Much Information.");
	});

	request.on("end", () => {
		{ // logging
			let address =
				request.rawHeaders.includes("DNT") ?
					"anon" : request.socket.address().address;

			let timestamp = time();

			console.log(`${timestamp} | request from ${address}`);
			console.log(`${" ".repeat(timestamp.length)}   for resource ${request.url}`);
		}

		request.post = qs.parse(data);

		let path = request.url.split("/").filter(str => str.length != 0);

		util.getPage(path, request).then((data) => {
			response.writeHead(data.code, { "Content-Type": data.type, "Connection": "close" });
			response.end(data.content);

			console.log(`${time()} | responed with a ${data.code}`);
		}).catch((e) => response.end(e));
	});
});

server.on("listening", () => {
	console.log("cyclic launched!");
	console.log(`listening at port ${server.address().port} of ${server.address().address}`);
	console.log("---");
});

server.listen(config.port);

function time() {
	let d = new Date();
	return `${d.getHours() + 1}:${d.getMinutes() + 1}:${d.getSeconds() + 1}`;
}
