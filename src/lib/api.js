class Channel {
	constructor(name, owner) {
		this.name = name;
		this.owner = owner;
	}
}

class Account {
	constructor(name) {
		this.name = name;
	}
}

let data = {
	"channels": [new Channel("rainmeter", "bupkis"), new Channel("bupkis", "rainmeter")],
	"accounts": [],
}

let endpoints = {
	"channels": (e) => { return data.channels },
}

function getEndpoints() {
	let eps = [];

	Object.keys(endpoints).forEach((e) =>
		eps.push(`/${e}/`));

	return eps;
}

function callEndpoint(path, parameters) {
	let eps = Object.keys(endpoints);

	for (let i = 0; i < eps.length; i++) {
		if (equalArrays(path, eps[i].split("/"))) {
			return endpoints[eps[i]](parameters);
		}
	}

	return { "error": { "code": 404, "message": "Invalid Api Endpoint Provided" } }
}

module.exports = exports = {
	getEndpoints: getEndpoints,
	callEndpoint: callEndpoint,
}

/**
 * @param {any[]} a
 * @param {any[]} b
 */
function equalArrays(a, b) {
	if (a.length != b.length)
		return false;

	for (let i = 0; i < a.length; i++) {
		if (a[i] != b[i])
			return false;
	}

	return true;
}
