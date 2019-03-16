const config = require("../../config");

let data = {
	"channels": [],
	"accounts": [],
}

class Message {
	/**
	 * creates a new message to be sent
	 * @param {string} content
	 * @param {Account} sender
	 * @param {object} [options={}]
	 * @memberof Message
	 */
	constructor(content, sender, options = {}) {
		this.content = content;
		this.sender = sender.name;

		{ // set message timestamp
			let d = new Date();
			this.date = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
			this.time = `${d.getHours() + 1}:${d.getMinutes() + 1}:${d.getSeconds() + 1}`;
		}

		this.options = {}
	}
}

class Channel {
	/**
	 * creates a new channel
	 * @param {string} name
	 * @param {Account} owner
	 * @memberof Channel
	 */
	constructor(name, owner) {
		this.name = name;

		this.owner = owner.name;
		this.members = [];
		this.messages = [];

		this.options = {
			public: false,
		}

		data.channels.push(this);
		owner.joinChannel(name);
	}
}

class Account {
	/**
	 * creates a new account
	 * @param {string} name
	 * @param {string} password
	 * @memberof Account
	 */
	constructor(name, password) {
		this.name = name;
		this.password = password;

		this.channels = [];

		this.options = {
			color: "dddddd",
		}

		data.accounts.push(this);
	}

	isMemberOf(channel) {
		let x;

		this.channels.forEach((c) => {
			if (c == channel) {
				data.channels.forEach((c) => {
					if (c.name == channel)
						x = c;
				});
			}
		});

		return x;
	}

	/**
	 * @param {string} channel
	 * @memberof Account
	 */
	joinChannel(channel) {
		let c = getChannel(channel);

		if (c) {
			this.channels.push(c.name);
			c.members.push(this.name);
		} else {
			throw "404 Invalid Channel";
		}
	}

	/**
	 * @param {string} channel
	 * @param {string} message
	 * @param {object} [options={}]
	 * @memberof Account
	 */
	send(channel, message, options = {}) {
		let c = this.isMemberOf(channel);

		if (c) {
			c.messages.push(new Message(message, this, options));
		} else {
			throw "404 Invalid Channel";
		}
	}
}

const admin = new Account(config.account.username, config.account.password);

let testChannel = new Channel("testchannel", admin);

testChannel.options.public = true;

admin.send("testchannel", "test");
admin.send("testchannel", "hello world");
admin.send("testchannel", "h");

let endpoints = {
	"channels": (p, e) => {
		let publics = data.channels.filter(channel => channel.options.public);
		let names = publics.map(channel => channel.name);

		return names;
	},
	"channels/*/read": (p, e) => {
		let channel = getChannel(p[1]);

		if (channel) {
			return {
				raw: channel.messages,
				html: channel.messages.map(m => {
					let tag = "";
					
					tag += `<div class="message">`;
						tag += `<div class="username">${m.sender}</div>`;
						tag += `<div class="content">${m.content}</div>`;
					tag += `</div>`;

					return tag;
				}).join("")
			}
		} else {
			return generateError(404, "Channel Does Not Exist");
		}
	},
	"channels/*/join": (p, e) => {
		let account = getAccount(e.post.username);

		if (account) {
			if (account.password == e.post.password) {
				try {
					account.joinChannel(p[1]);
					return generateSuccess("Channel Joined")
				} catch (e) {
					return generateError(400, e);
				}
			} else {
				return generateError(401, "Invalid Account Password");
			}
		} else {
			return generateError(404, "Account Does Not Exist");
		}
	},
	"channels/*/send": (p, e) => {
		let account = getAccount(e.post.username);

		if (account) {
			if (account.password == e.post.password) {
				try {
					account.send(p[1], e.post.message);
					return generateSuccess("Message Sent")
				} catch (e) {
					return generateError(400, e);
				}
			} else {
				return generateError(401, "Invalid Account Password");
			}
		} else {
			return generateError(404, "Account Does Not Exist");
		}
	},
	"channels/create": (p, e) => {},
	"channels/delete": (p, e) => {},
	"channels/*": (p, e) => {
		let channel = getChannel(p[1]);

		return channel || generateError(404, "Channel Does Not Exist");
	},
	"accounts": (p, e) => {},
	"accounts/authenticate": (p, e) => {
		let account = getAccount(e.post.username);

		if (account) {
			if (account.password == e.post.password) {
				return generateSuccess("Valid");
			} else {
				return generateError(401, "Invalid Account Password");
			}
		} else {
			return generateError(404, "Account Does Not Exist");
		}
	},
	"accounts/create": (p, e) => {
		let account = getAccount(e.post.username);

		if (account) {
			return generateError(400, "Account Has Already Been Claimed");
		} else {
			if (!e.post.username || !e.post.password) {
				return generateError(400, "No Username or Password Provided");
			} else {
				if (e.post.username.length != 0 && e.post.password.length != 0) {
					new Account(e.post.username, e.post.password);
					return generateSuccess("Account Created");
				} else {
					return generateError(400, "Invalid Username or Password Provided");
				}
			}
		}
	},
	"accounts/delete": (p, e) => {},
	"accounts/*": (p, e) => {},
}

function getEndpoints() {
	let eps = [];

	Object.keys(endpoints).forEach((e) =>
		eps.push(`/${e.replace(/\*/g, "any")}/`));

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

function getChannel(channel) {
	let x;

	data.channels.forEach((c) => {
		if (!x && channel == c.name)
			x = c;
	});

	return x;
}

function getAccount(account) {
	let x;

	data.accounts.forEach((a) => {
		if (!x && account == a.name)
			x = a;
	});

	return x;
}

function generateError(code, message) {
	return { "error": { "code": code, "message": message } }
}

function generateSuccess(message, code = 200) {
	return { "success": { "code": code, "message": message } }
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
