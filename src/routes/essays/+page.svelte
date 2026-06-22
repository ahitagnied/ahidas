<script>
	import EssayItem from '$lib/components/EssayItem.svelte';
	import { getPublishedEssays } from '$lib/utils/essays.js';

	const essays = getPublishedEssays();
</script>

<svelte:head>
	<title>Ahitagni D | Essays</title>
</svelte:head>

<div class="page-container">
	<div class="mb-[1.2em] item-title">
		<a href="/" class="no-underline" style="color: inherit">Ahitagni Das</a><span class="text-muted">{' — '}Essays</span>
	</div>

	{#each essays as essay (essay.slug)}
		<EssayItem item={essay} />
	{/each}
</div>
