<script>
	export let type;
</script>

<p class={"alert" + (type ? (" alert-type-" + type) : "")}>
	<slot />
</p>

<style type="text/scss">
@import "../styles/_variables";

.alert {
	border-left: .5rem solid #e53935;
	background-color: lightgray;
	padding: 1rem;
	padding-left: 1.25rem;

	color: darken($color-secondary, 15%);

	&.alert-type-info {
		border-left-color: #64b5f6;
	}
}
</style>
