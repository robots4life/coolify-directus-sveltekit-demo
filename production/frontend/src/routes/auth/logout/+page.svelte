<script lang="ts">
	import { enhance } from '$app/forms';
	import { page as pageStore } from '$app/stores';
	import AuthNav from '../AuthNav.svelte';
	let { form } = $props();
</script>

{#if form?.status || form?.statusText || form?.message}
	<p>Status : {form.status}</p>
	<p>StatusText : {form.statusText}</p>
	<p>Message : {form.message}</p>
{/if}

<form action="?/logout" method="POST" use:enhance>
	<button type="submit"
		><strong>Log Out</strong> through Form handled on <strong>Server</strong></button
	>
</form>

<hr />

<pre>$pageStore : {JSON.stringify($pageStore, null, 2)}</pre>

<hr />

<AuthNav></AuthNav>
