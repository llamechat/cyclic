const fs = require("fs");

/**
 * @param {string[]} path
 */
function getPage(path) {
	return new Promise((resolve, reject) => {	
		if (path.length == 0) {
			getHtml("./src/index.xml")
				.then((data) => resolve({ code: 200, type: "text/html", content: data }))
				.catch((e) => reject({ code: 500, type: "text/html", content: e }));
		} else switch (path[0]) {
			default: {
				resolve({ code: 404, type: "text/html", content: "404" })
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
