<script lang="ts">
	import { enhance } from '$app/forms';
	import { page as pageStore } from '$app/stores';
	import AuthNav from '../AuthNav.svelte';
	let { form } = $props();

	const email = 'admin@example.com';
	const password = '1234';
</script>

{#if form?.status || form?.statusText || form?.message}
	<p>Status : {form.status}</p>
	<p>StatusText : {form.statusText}</p>
	<p>Message : {form.message}</p>
{/if}

<form action="?/login" method="POST" use:enhance>
	<label for="email">Email</label>
	<input id="email" name="email" type="text" value={email} required />

	<label for="password">Password</label>
	<input id="password" name="password" type="password" value={password} required />

	<button type="submit"
		><strong>Log In</strong> through Form handled on <strong>Server</strong></button
	>
</form>

<hr />

<pre>$pageStore : {JSON.stringify($pageStore, null, 2)}</pre>

<hr />

<AuthNav></AuthNav>
