<script>
	import Icon from '@iconify/svelte';
	import EssayItem from '$lib/components/EssayItem.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { getPublishedEssays } from '$lib/utils/essays.js';

	const essays = getPublishedEssays();
</script>

<svelte:head>
	<title>Ahitagni D | Essays</title>
</svelte:head>

<div class="page-container">
	<div class="flex justify-between items-center mb-[1.2em]">
		<h1 class="mb-0">
			<a href="/" class="section-link group">
				Essays
				<Icon icon="mdi:arrow-bottom-left" class="arrow-icon" />
			</a>
		</h1>
		<ThemeToggle />
	</div>

	{#each essays as essay (essay.slug)}
		<EssayItem item={essay} />
	{/each}
</div>
