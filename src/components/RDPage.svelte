<script>
	import { stores } from "@sapper/app";
	const { session } = stores();

	let USER;
	session.subscribe(value => USER = value.USER);
</script>

<div>
	<header>
		<a href="/"><h1>RedirectDog</h1></a>
		{#if USER}
			<div>
				<div>Logged in as {USER.id}</div>
				<div><a href="/redirects">My Redirects</a></div>
			</div>
		{:else}
			<div><a class="slightlyLarger" href="/login">Login</a></div>
		{/if}
	</header>
	<slot />
</div>

<style>
	header {
		margin: -1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid gray;

		padding-bottom: 0;
		padding-top: .5rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	header h1 {
		margin-bottom: 0;
	}
	header > div {
		display: inline-block;
		height: 100%;
	}

	.slightlyLarger {
		font-size: 1.25em;
	}
</style>
