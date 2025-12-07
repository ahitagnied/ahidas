<script>
	import EssayItem from '$lib/components/EssayItem.svelte';
	import { loadEssays } from '$lib/utils/essays.js';

	const essays = loadEssays();
</script>

<svelte:head>
	<title>Ahitagni D | Essays</title>
</svelte:head>

<div class="page-container">
	<h1>Essays</h1>

	{#each essays as essay}
		<EssayItem item={essay} />
	{/each}
</div>
