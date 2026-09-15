<script lang="ts">
	import About from '$lib/components/About.svelte';
	import ResearchGrid from '$lib/components/ResearchGrid.svelte';
</script>

<svelte:head>
	<title>Ahitagni Das</title>
	<meta name="description" content="Ahitagni Das" />
</svelte:head>

<main>
	<About />
	<h2 class="site pt-[calc(2*var(--spacing-row))] text-name font-normal tracking-[-0.015em]">
		Research
	</h2>
	<ResearchGrid />
</main>
