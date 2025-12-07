<script>
	import ResearchItem from '$lib/components/ResearchItem.svelte';
	import researchData from '$lib/data/research.yml?raw';
	import yaml from 'js-yaml';

	const researchItems = yaml.load(researchData);
</script>

<svelte:head>
	<title>Ahitagni D | Research</title>
</svelte:head>

<div class="page-container">
	<h1>Research</h1>

	{#each researchItems as item}
		<ResearchItem {item} />
	{/each}
</div>
