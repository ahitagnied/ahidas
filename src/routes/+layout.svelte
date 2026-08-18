<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import './layout.css';

	let { children } = $props();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#key $page.url.pathname + mounted}
	<div in:fly={{ y: 20, duration: 400, delay: 100 }}>
		{@render children()}
	</div>
{/key}
