<script>
	import * as sapper from "@sapper/app";

	import fetchWithError from "../util/fetchWithError";
	import showError from "../util/showError";

	import ButtonFooter from "../components/ButtonFooter.svelte";
	import RDPage from "../components/RDPage.svelte";
	import SmallBox from "../components/SmallBox.svelte";

	let host = "";
	let destination = "";
	let submitting = false;
	function submit() {
		submitting = true;

		fetchWithError(
			"/api/users/~me/redirects",
			{
				method: "POST",
				body: JSON.stringify({host, destination}),
			}
		)
			.then(res => res.text())
			.then(idStr => parseInt(idStr, 10))
			.then(id => {
				sapper.goto("/redirects");
			})
			.catch(showError)
			.then(() => submitting = false);
	}
</script>

<svelte:head>
	<title>Create New Redirect</title>
</svelte:head>

<RDPage>
	<SmallBox>
		<h2 class="box-header">New Redirect</h2>
		<form on:submit|preventDefault={submit}>
			<div>
				<input name="host" type="text" bind:value={host} placeholder="Host" />
			</div>
			<div>
				<input name="destination" type="text" bind:value={destination} placeholder="Destination" />
			</div>
			<ButtonFooter>
				<button type="submit" disabled={submitting}>
					{#if submitting}Saving…{:else}Save{/if}
				</button>
			</ButtonFooter>
		</form>
	</SmallBox>
</RDPage>
