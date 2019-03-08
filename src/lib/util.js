const fs = require("fs");

/**
 * @param {string[]} path
 */
function getPage(path) {
	return new Promise((resolve, reject) => {
		let type = "text/html";
		let content = "";
	
		if (path.length == 0) {
			getHtml("./src/index.xml").then((data) => {
				content = data;
				resolve({ type: type, content: content });
			}).catch((e) => reject({ type: "text/html", content: e }));
		} else switch (path[0]) {
			default: {
				content = "404";
			}
		}
	});
}

function getHtml(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (e, data) => {
			if (e) reject(e);
			
			resolve(data);
		});
	});
}

module.exports = exports = {
	getPage: getPage,
	getHtml: getHtml,
}
