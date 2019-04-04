import polka from "polka";
import compression from "compression";
import * as sapper from "../__sapper__/server.js";

const PORT = process.env.PORT || 3000;
const PROD = process.env.NODE_ENV === "production";

polka()
	.use(
		compression({threshold: 0}),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if(err) console.error(err);
	});
