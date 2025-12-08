<script>
	import EssayItem from '$lib/components/EssayItem.svelte';
	import { getPublishedEssays } from '$lib/utils/essays.js';

	const essays = getPublishedEssays();
</script>

<svelte:head>
	<title>Ahitagni D | Essays</title>
</svelte:head>

<div class="page-container">
	<div class="flex justify-between items-center mb-[1.2em]">
		<h1 class="mb-0">Essays</h1>
		<a
			href="/"
			class="text-gray-600 hover:text-gray-800 no-underline text-[12px]"
			>← Back</a
		>
	</div>

	{#each essays as essay (essay.slug)}
		<EssayItem item={essay} />
	{/each}
</div>
