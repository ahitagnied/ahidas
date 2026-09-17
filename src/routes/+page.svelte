<script lang="ts">
	import About from '$lib/components/About.svelte';
	import ResearchGrid from '$lib/components/ResearchGrid.svelte';
</script>

<svelte:head>
	<title>Ahitagni Das</title>
	<meta name="description" content="Ahitagni Das" />
</svelte:head>

<main class="flex flex-col gap-y-[calc(2*var(--spacing-row))] pt-[calc(2*var(--spacing-row))]">
	<About />

	<section class="site">
		<h2 class="text-name font-normal leading-none tracking-[-0.015em]">Research</h2>
		<ResearchGrid />
	</section>

	<section class="site">
		<h2 class="text-name font-normal leading-none tracking-[-0.015em]">Contact</h2>
		<p class="meta pt-row text-[13.5px] leading-[1.5]">
			<a href="mailto:adas@rice.edu">adas@rice.edu</a>
		</p>
	</section>

	<section class="site">
		<h2 class="text-name font-normal leading-none tracking-[-0.015em]">Elsewhere</h2>
		<p class="meta pt-row text-[13.5px] leading-[1.5]">
			<a href="https://scholar.google.com/citations?user=GLTc7LcAAAAJ&hl=en">Google Scholar</a>,
			<a href="https://github.com/ahitagnied">GitHub</a>,
			<a href="https://www.linkedin.com/in/ahitagnid/">LinkedIn</a>,
			<a href="https://x.com/ahitagnied">Twitter</a>
		</p>
	</section>
</main>
