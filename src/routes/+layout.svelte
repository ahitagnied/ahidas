<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="site">
	<h1 class="text-name font-normal leading-none tracking-[-0.015em]">Ahitagni Das</h1>
</header>

{@render children()}
