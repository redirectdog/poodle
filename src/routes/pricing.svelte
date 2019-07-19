<script context="module">
	export function preload({params, query}) {
		return Promise.all([
			fetchWithError("/api/subscription_tiers", {}, this.fetch)
			.then(res => res.json()),
			fetchWithError("/api/settings", {}, this.fetch)
			.then(res => res.json()),
			fetchWithError("/api/users/~me/subscription_tier", {credentials: "include"}, this.fetch)
			.then(res => res.json())
			.catch(() => {}),
		])
		.then(([tiers, settings, myTier]) => ({tiers, settings, myTier}));
	}

	let _stripeJSPromise = null;

	function loadStripeJS() {
		if(_stripeJSPromise === null) {
			_stripeJSPromise = import("get-js").then(getJS => getJS.default("https://js.stripe.com/v3/"));
		}
		return _stripeJSPromise;
	}
</script>

<script>
	import fetchWithError from "../util/fetchWithError";

	import RDPage from "../components/RDPage.svelte";

	export let myTier;
	export let settings;
	export let tiers;

	let loadingPurchase = false;

	function choosePlan(tier) {
		console.log(tier);

		loadingPurchase = true;

		Promise.all([
			loadStripeJS(),
			fetchWithError("/api/users/~me/checkout_sessions", {method: "POST", body: JSON.stringify({subscription_tier: tier.id})})
			.then(res => res.json()),
		])
			.then(([, session]) => {
				const stripe = Stripe(settings.stripe_publishable_key);

				return stripe.redirectToCheckout({sessionId: session.stripe_session});
			})
			.catch(err => {
				console.error(err);
				alert("An unexpected error occurred.");
			});
	}
</script>

<svelte:head>
	<title>Pricing</title>
</svelte:head>

<RDPage>
	<div class="pricingRow">
		{#each tiers as tier}
			<div>
				<h3>{tier.name}</h3>
				<ul>
					{#if tier.visit_limit === 0}
						<li>{settings.free_visits} requests per month per host</li>
					{:else}
						<li>{tier.visit_limit.toLocaleString()} requests per month</li>
					{/if}
				</ul>
				<div class="spacer" />
				<div class="buttonArea">
					{#if myTier && tier.id === myTier.id}
						<button disabled>Current</button>
					{:else}
						<button on:click={() => choosePlan(tier)}>Choose</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</RDPage>

<style>
	.pricingRow {
		display: flex;
		max-width: 80rem;
		margin-left: auto;
		margin-right: auto;
	}

	.pricingRow > div {
		flex-grow: 1;
		margin: 2rem;
		padding: 1rem;
		box-shadow: #888 1px 1px 3px;
		border-radius: 1px;
	}

	.pricingRow > div > h3 {
		text-align: center;
	}

	.pricingRow > div > .buttonArea {
		text-align: center;
	}

	@media (max-width: 40rem) {
		.pricingRow {
			flex-direction: column;
			max-width: 40rem;
		}
	}
</style>
