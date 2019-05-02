import { Store } from "svelte/store";
import * as sapper from "../__sapper__/client.js";

sapper.start({
	target: document.getElementById("sapper"),
	store: data => new Store(data),
});
