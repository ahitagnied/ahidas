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
	<h1 class="mb-[1.2em]">
		<a href="/" class="section-link group">
			Research
			<Icon icon="mdi:arrow-bottom-left" class="arrow-icon" />
		</a>
	</h1>

	{#each researchItems as item (item.title)}
		<ResearchItem {item} />
	{/each}
</div>
