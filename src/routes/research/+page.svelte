<script>
	import Icon from '@iconify/svelte';
	import ResearchItem from '$lib/components/ResearchItem.svelte';
	import researchData from '$lib/data/research.yml?raw';
	import yaml from 'js-yaml';

	const researchItems = yaml.load(researchData);
</script>

<svelte:head>
	<title>Ahitagni D | Research</title>
</svelte:head>

<div class="page-container">
	<div class="mb-[1.2em] item-title">
		<a href="/" class="no-underline" style="color: inherit">Ahitagni Das</a>
		<span class="text-muted"> — Research</span>
	</div>

	{#each researchItems as item (item.title)}
		<ResearchItem {item} />
	{/each}
</div>
