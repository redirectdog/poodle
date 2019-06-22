<script context="module">
	export function preload({params, query}) {
		return this.fetch("/api/users/~me/redirects", {credentials: "include"})
			.then(res => res.json())
			.then(res => {
				return {redirects: res};
			});
	}
</script>

<script>
	import fetchWithError from "../util/fetchWithError";
	import showError from "../util/showError";

	import RDPage from "../components/RDPage.svelte";

	export let redirects;
</script>

<svelte:head>
	<title>My Redirects</title>
</svelte:head>

<RDPage>
	<a class="button" href="/newRedirect">New</a>
	<table>
		<tr>
			<th>Redirect</th>
			<th>Total Visits</th>
			<th>Visits in the Last Month</th>
		</tr>
		{#each redirects as redirect}
		<tr>
			<td>
				{redirect.host} -&gt; {redirect.destination}
			</td>
			<td>{redirect.visits_total}</td>
			<td>{redirect.visits_month}</td>
		</tr>
		{/each}
	</table>
</RDPage>
