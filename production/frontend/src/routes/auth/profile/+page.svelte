<script lang="ts">
	let { data } = $props();

	import { page as pageStore } from '$app/stores';
	import AuthNav from '../AuthNav.svelte';
</script>

<pre>data : {JSON.stringify(data, null, 2)}</pre>

<hr />

<pre>$pageStore : {JSON.stringify($pageStore, null, 2)}</pre>

<hr />

<AuthNav></AuthNav>
