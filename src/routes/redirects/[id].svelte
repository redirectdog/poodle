<script context="module">
	export function preload({params, query}) {
		return Promise.all([
			fetchWithError("/api/redirects/" + encodeURIComponent(params.id), {credentials: "include"}, this.fetch)
				.then(res => res.json()),
			fetchWithError("/api/settings", {}, this.fetch)
				.then(res => res.json()),
		])
		.then(([info, settings]) => ({info, settings}));
	}
</script>

<script>
	import fetchWithError from "../../util/fetchWithError";
	import showError from "../../util/showError";

	import Alert from "../../components/Alert.svelte";
	import RDPage from "../../components/RDPage.svelte";

	export let info;
	export let settings;

	let submittingDestination = false;
	let submittingEnableTLS = false;

	function editDestination() {
		const newDestination = prompt("New destination?", info.destination);
		if(newDestination && newDestination !== info.destination) {
			submittingDestination = true;
			fetchWithError("/api/redirects/" + encodeURIComponent(info.id), {method: "PATCH", body: JSON.stringify({destination: newDestination}), headers: {"Content-type": "application/json"}})
				.then(() => {
					info.destination = newDestination;
				})
				.catch(showError)
				.then(() => submittingDestination = false);
		}
	}
</script>

<svelte:head>
	<title>Redirect</title>
</svelte:head>

<RDPage>
	<p>
		<a href="/redirects">← My Redirects</a>
	</p>
	<h1>{info.host}</h1>
	<h2 class="destination">
		{info.destination}
		<button class="smallButton" on:click={editDestination} disabled={submittingDestination}>
			{#if submittingDestination}
				Saving…
			{:else}
				Edit
			{/if}
		</button>
	</h2>
	{#if !info.record_confirmed && settings.redirect_host}
		<Alert type="info">To finish setup, add a CNAME or ALIAS record pointing to <code>{settings.redirect_host}</code> with your DNS provider.</Alert>
	{/if}
	{#if info.record_confirmed || info.tls.state === "ready"}
		<h3>TLS</h3>
		<p>
			{#if info.tls.state === "pending"}
				Queued for certificate generation, should be ready soon
			{:else if info.tls.state === "error"}
				<Alert>
					Certificate generation failed.
				</Alert>
			{:else if info.tls.state === "ready"}
				TLS is ready.
			{:else}
				<Alert>Unknown state: {info.tls.state}</Alert>
			{/if}
		</p>
	{/if}
</RDPage>

<style>
	.destination:before {
		content: "→ ";
	}

	.smallButton {
		padding: 0 1rem;
		line-height: 1rem;
		height: 3rem;
	}
</style>
