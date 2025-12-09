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
	<div class="flex justify-between items-center mb-[1.2em]">
		<h1 class="mb-0">Research</h1>
		<a href="/" class="back-link group">
			<Icon icon="mdi:arrow-bottom-left" class="arrow-icon-left" />
			Back
		</a>
	</div>

	{#each researchItems as item (item.title)}
		<ResearchItem {item} />
	{/each}
</div>
