const fs = require("fs");
const api = require("./api");

/**
 * @param {string[]} path
 */
function getPage(path) {
	return new Promise((resolve, reject) => {	
		if (path.length == 0) {
			getFile("./src/index.xml")
				.then((data) => resolve({ code: 200, type: "text/html", content: data }))
				.catch((e) => reject({ code: 404, type: "text/html", content: e }));
		} else switch (path[0]) {
			case "css": {
				getFile(`./src/${path[1]}.css`)
					.then((data) => resolve({ code: 200, type: "text/css", content: data }))
					.catch((e) => reject({ code: 404, type: "text/html", content: e }));
			} break;

			case "api": {
				let result;

				if (path.length == 1) {
					result = api.getEndpoints();
				} else {
					path.shift();

					result = api.callEndpoint(path, {});
				}

				resolve({ code: 200, type: "application/json", content: JSON.stringify(result) });
			} break;

			default: {
				resolve({ code: 404, type: "text/html", content: "404" })
			}
		}
	});
}

function getFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (e, data) => {
			if (e) reject(e);
			resolve(data);
		});
	});
}

module.exports = exports = {
	getPage: getPage,
	getFile: getFile,
}
