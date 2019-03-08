let endpoints = {
	"channels": (e) => {},
}

function getEndpoints() {
	let eps = [];

	Object.keys(endpoints).forEach((e) =>
		eps.push(`/${e}/`));

	return eps;
}

module.exports = exports = {
	getEndpoints: getEndpoints,
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
