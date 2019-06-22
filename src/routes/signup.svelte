<script>
	import fetchWithError from "../util/fetchWithError";

	import Alert from "../components/Alert.svelte";
	import ButtonFooter from "../components/ButtonFooter.svelte";
	import RDPage from "../components/RDPage.svelte";
	import SmallBox from "../components/SmallBox.svelte";

	let email = "";
	let password = "";
	let submitting = false;
	let error = null;
	let success = false;

	function submit() {
		submitting = true;
		fetchWithError(
			"/api/users",
			{
				method: "POST",
				body: JSON.stringify({email, password}),
				headers: {"Content-Type": "application/json"},
			}
		)
			.then(() => {
				success = true;
			})
			.catch(err => {
				console.error(err);
				error = err;
			})
			.then(() => submitting = false);
	}
</script>

<svelte:head>
	<title>Signup</title>
</svelte:head>

<RDPage>
	<SmallBox>
		<h2 class="box-header">Signup</h2>
		{#if success}
			<div>
				Successfully signed up! You can now <a href="/login">Log in</a>
			</div>
		{:else}
			{#if !submitting && error !== null}
				<Alert>
					Failed to sign up: {error + ""}
				</Alert>
			{/if}
			<form on:submit|preventDefault={submit}>
				<div>
					<input type="text" bind:value={email} placeholder="Email Address" />
				</div>
				<div>
					<input type="password" bind:value={password} placeholder="Password" />
				</div>
				<ButtonFooter>
					<button type="submit" disabled={submitting}>
						{#if submitting}Creating Account...{:else}Create Account{/if}
					</button>
				</ButtonFooter>
			</form>
		{/if}
	</SmallBox>
</RDPage>
