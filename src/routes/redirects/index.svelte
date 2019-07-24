<script context="module">
	export function preload({params, query}) {
		return fetchWithError("/api/users/~me/redirects", {credentials: "include"}, this.fetch)
			.then(
				res => {
					return res.json()
					.then(res => {
						return {redirects: res};
					});
				},
				err => {
					if(err === "Login is required for '~me' paths") {
						this.redirect(302, 'login');
					}
					return Promise.reject(err);
				}
			);
	}
</script>

<script>
	import fetchWithError from "../../util/fetchWithError";
	import showError from "../../util/showError";

	import LinkRow from "../../components/LinkRow.svelte";
	import RDPage from "../../components/RDPage.svelte";

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
			<LinkRow href={"/redirects/" + redirect.id}>
				<td>
			  {redirect.host} -&gt; {redirect.destination}
				</td>
				<td>{redirect.visits_total}</td>
				<td>{redirect.visits_month}</td>
			</LinkRow>
		{/each}
	</table>
</RDPage>
