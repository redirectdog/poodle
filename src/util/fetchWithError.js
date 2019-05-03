export default function fetchWithError(url, options) {
	return fetch(url, options)
	.then(res => {
		if(res.status >= 200 && res.status < 300) {
			return res;
		}
		else {
			return res.text().then(Promise.reject.bind(Promise));
		}
	});
}
