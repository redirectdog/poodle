import polka from "polka";
import compression from "compression";
import http from "http";
import httpProxy from "http-proxy";
import isomorphicCookie from "isomorphic-cookie";
import * as sapper from "../__sapper__/server.js";

const PORT = process.env.PORT || 3000;
const DALMATIAN_HOST = process.env.DALMATIAN_HOST || "http://localhost:5000";

const clientServer = polka()
	.use(
		compression({threshold: 0}),
		sapper.middleware(),
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
		clientServer.handler(req, res);
	}
}).listen(PORT);
