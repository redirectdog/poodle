import polka from "polka";
import compression from "compression";
import fetch from "node-fetch";
import http from "http";
import httpProxy from "http-proxy";
import isomorphicCookie from "isomorphic-cookie";
import { Store as SvelteStore } from "svelte/store";
import * as sapper from "../__sapper__/server.js";

const PORT = process.env.PORT || 3000;
const DALMATIAN_HOST = process.env.DALMATIAN_HOST || "http://localhost:5000";

const clientServer = polka()
	.use(
		compression({threshold: 0}),
		sapper.middleware({store: req => new SvelteStore(req.__rdData)}),
	);

const apiServer = httpProxy.createProxyServer({});
apiServer.on("proxyReq", function(proxyReq, req, res, options) {
	const token = isomorphicCookie.load("poodleToken", req);
	if(token) {
		proxyReq.setHeader("Authorization", "Bearer " + token);
	}
});

http.createServer(function(req, res) {
	if(req.url.startsWith("/api")) {
		req.url = req.url.substring(4);
		apiServer.web(req, res, {target: DALMATIAN_HOST}, function(e) {
			console.error(e);
			try {
				res.writeHead(500);
				res.end("Proxy handler failed");
			} catch(ex) {
				console.error(ex);
			}
		});
	}
	else {
		const token = isomorphicCookie.load("poodleToken", req);
		(token ?
			fetch("http://localhost:" + PORT + "/api/users/~me", {headers: {"Cookie": "poodleToken=" + token}})
			.then(res => {
				if(res.status >= 200 && res.status < 300) {
					return res.json();
				} else {
					return res.text().then(Promise.reject.bind(Promise));
				}
			})
			.then(res => {
				return {
					USER: res,
				};
			}, err => {
				return {};
			}) :
			Promise.resolve({}))
		.then(data => {
			req.__rdData = data;
			clientServer.handler(req, res);
		});
	}
}).listen(PORT);
