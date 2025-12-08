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
	<div class="flex justify-between items-center mb-[1.2em]">
		<h1 class="mb-0">Research</h1>
		<a
			href="/"
			class="text-gray-600 hover:text-gray-800 no-underline text-[12px]"
			>← Back</a
		>
	</div>

	{#each researchItems as item (item.title)}
		<ResearchItem {item} />
	{/each}
</div>
