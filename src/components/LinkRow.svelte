<script>
	import * as sapper from "@sapper/app";

	export let href;
</script>

<tr class="linkRow" on:click={() => sapper.goto(href)}><slot /></tr>

<style>
	.linkRow {
		cursor: pointer;
	}

	.linkRow:hover {
		background-color: #606c7620;
	}
</style>
