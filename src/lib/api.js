const qs = require("querystring");

class Channel {
	constructor(name, owner) {
		this.name = name;

		this.owner = owner;
		this.members = [owner]

		this.options = {
			public: false,
		}
	}
}

class Account {
	constructor(name, password, email) {
		this.name = name;
		this.password = password;
		this.email = email;

		this.options = {
			color: "dddddd",
		}
	}
}

let data = {
	"channels": [
		new Channel("testchannel", undefined),
	],
	"accounts": [],
}

let endpoints = {
	"channels": (p, e) => {
		let publics = data.channels.filter(channel => channel.options.public);
		let names = publics.map(channel => channel.name);

		return names;
	},
	"channels/*": (p, e) => {
		let channel;

		data.channels.forEach((c) => {
			if (!channel && p[1] == c.name)
				channel = c;
		});

		return channel || generateError(404, "Channel Does Not Exist");
	},
	"channels/*/send": (p, e) => {},
	"channels/*/delete": (p, e) => {},
	"channels/*/create": (p, e) => {},
	"accounts": (p, e) => {},
	"accounts/*": (p, e) => {},
	"accounts/*/authenticate": (p, e) => {},
	"accounts/*/delete": (p, e) => {},
	"accounts/*/create": (p, e) => {},
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
			return endpoints[eps[i]](path, parameters);
		}
	}

	return generateError(404, "Invalid Api Endpoint Provided");
}

function generateError(code, message) {
	return { "error": { "code": code, "message": message } }
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
		if (a[i] != b[i] && a[i] != "*" && b[i] != "*") {
			return false;
		}
	}

	return true;
}