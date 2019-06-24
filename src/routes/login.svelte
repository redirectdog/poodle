<script>
	import * as sapper from "@sapper/app";
	import { stores } from "@sapper/app";
	const { session } = stores();

	import fetchWithError from "../util/fetchWithError";

	import Alert from "../components/Alert.svelte";
	import ButtonFooter from "../components/ButtonFooter.svelte";
	import RDPage from "../components/RDPage.svelte";
	import SmallBox from "../components/SmallBox.svelte";

	let email = "";
	let password = "";
	let success = false;
	let submitting = false;
	let error = null;
	let remember = false;
	function submit() {
		submitting = true;
		fetchWithError(
			"/api/logins",
			{
				method: "POST",
				body: JSON.stringify({email, password}),
				headers: {"Content-Type": "application/json"},
			},
		)
			.then(res => res.text())
			.then(res => {
				console.log("result is", res);
				document.cookie = "poodleToken=" + res + ";path=/" + (remember ? ";max-age=31536000" : "");
				success = true;
				fetch("/api/users/~me")
					.then(res => res.json())
					.then(res => {
						session.update(value => ({...value, USER: res}));
						sapper.goto("redirects");
					});
			})
			.catch(err => {
				console.error(err);
				console.log("??");
				error = err;
			})
			.then(() => submitting = false);
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<RDPage>
	<SmallBox>
		<h2 class="box-header">Login</h2>
		{#if success}
			<div>
				<p>
					Successfully logged in.
				</p>
				<p>
					<a href="/redirects">My Redirects</a>
				</p>
			</div>
		{:else}
			{#if !submitting && error !== null}
				<Alert>Login failed: {error + ""}</Alert>
			{/if}
			<form on:submit|preventDefault={submit}>
				<div>
					<input name="username" type="text" bind:value={email} placeholder="Email Address" />
				</div>
				<div>
					<input name="password" type="password" bind:value={password} placeholder="Password" />
				</div>
				<div>
					<label>
						<input type="checkbox" bind:value={remember} />
						Remember Me
					</label>
				</div>
				<ButtonFooter>
					<button type="submit" disabled={submitting}>
						{#if submitting}Logging in...{:else}Login{/if}
					</button>
				</ButtonFooter>
			</form>
		{/if}
	</SmallBox>
</RDPage>
