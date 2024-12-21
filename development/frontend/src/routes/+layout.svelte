<script lang="ts">
	import Navigation from '$lib/components/base/Navigation.svelte';
	import '../app.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Navigation></Navigation>

<main
	class="260:flex 260:px-4 mx-auto hidden w-full max-w-[1800px] flex-col gap-4 pt-4 md:px-6 lg:px-8"
>
	{@render children?.()}
</main>

<style>
	/* https://svelte.dev/docs/svelte/global-styles */
	:global(html) {
		overflow-y: scroll;
	}

	:global(h1) {
		font-size: 3rem;
	}

	:global(h2) {
		font-size: 2rem;
	}

	:global(h3) {
		font-size: 1.4rem;
	}

	:global(blockquote) {
		background-color: darkgreen;
		color: blanchedalmond;
		padding: 1.4rem;
		border-radius: 8px;
		font-family: serif;
		font-size: 1.4rem;
		border: 2px solid gold;
	}
</style>
