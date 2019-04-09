import polka from "polka";
import compression from "compression";
import http from "http";
import httpProxy from "http-proxy";
import * as sapper from "../__sapper__/server.js";

const PORT = process.env.PORT || 3000;
const PROD = process.env.NODE_ENV === "production";

const clientServer = polka()
	.use(
		compression({threshold: 0}),
		sapper.middleware(),
	);

const apiServer = httpProxy.createProxyServer({});

http.createServer(function(req, res) {
	if(req.url.startsWith("/api")) {
		req.url = req.url.substring(4);
		apiServer.web(req, res, {target: "http://localhost:5000"}, function(e) {
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
