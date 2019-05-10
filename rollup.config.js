import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import sass from "rollup-plugin-sass";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";

import { sass as preprocessSass } from "svelte-preprocess-sass";

import sapperConfig from "sapper/config/rollup.js";

const mode = process.env.NODE_ENV === "production" ? "production" : "development";
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const sveltePreprocessConfig = {style: preprocessSass({}, {name: "scss"})};

export default {
	client: {
		input: sapperConfig.client.input(),
		output: sapperConfig.client.output(),
		plugins: [
			replace({
				"process.browser": true,
				"process.env.NODE_ENV": JSON.stringify(mode),
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess: sveltePreprocessConfig,
			}),
			resolve(),
			commonjs(),

			legacy && babel({
				extensions: [".js", ".html"],
				runtimeHelpers: true,
				exclude: ["node_modules/@babel/*"],
				presets: [
					["@babel/preset-env", {targets: "> 0.25%, not dead"}]
				],
				plugins: [
					"@babel/plugin-syntax-dynamic-import",
					["@babel/plugin-transform-runtime", {
						useESModules: true,
					}],
				],
			}),

			!dev && terser({module: true}),
			sass({insert: true, include: "**/*.scss", exclude: []}),
		],
	},

	server: {
		input: sapperConfig.server.input(),
		output: sapperConfig.server.output(),
		plugins: [
			replace({
				"process.browser": false,
				"process.env.NODE_ENV": JSON.stringify(mode),
			}),
			svelte({
				generate: "ssr",
				dev,
				preprocess: sveltePreprocessConfig,
			}),
			resolve(),
			commonjs(),
		],
		external: Object.keys(require("./package.json").dependencies)
		.concat(require("module").builtinModules || Object.keys(process.binding("natives"))), // ????
	}
};
