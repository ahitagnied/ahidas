<script>
	import Icon from '@iconify/svelte';
	import ResearchItem from '$lib/components/ResearchItem.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import researchData from '$lib/data/research.yml?raw';
	import yaml from 'js-yaml';

	const researchItems = yaml.load(researchData);
</script>

<svelte:head>
	<title>Ahitagni D | Research</title>
</svelte:head>

<div class="page-container">
	<div class="flex justify-between items-center mb-[1.2em]">
		<h1 class="mb-0">
			<a href="/" class="section-link group">
				Research
				<Icon icon="mdi:arrow-bottom-left" class="arrow-icon" />
			</a>
		</h1>
		<ThemeToggle />
	</div>

	{#each researchItems as item (item.title)}
		<ResearchItem {item} />
	{/each}
</div>
