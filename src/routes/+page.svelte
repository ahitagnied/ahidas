<script>
	import ResearchItem from '$lib/components/ResearchItem.svelte';
	import EssayItem from '$lib/components/EssayItem.svelte';
	import researchData from '$lib/data/research.yml?raw';
	import yaml from 'js-yaml';
	import { getPublishedEssays } from '$lib/utils/essays.js';
	import { link } from '$lib/utils/refLink.js';

	const researchItems = yaml.load(researchData);
	const displayItems = researchItems.slice(0, 3);

	const essays = getPublishedEssays();
	const displayEssays = essays.slice(0, 5);
</script>

<svelte:head>
	<title>Ahitagni D | Home</title>
</svelte:head>

<div class="page-container">
	<div class="flex justify-between items-baseline mb-[1.2em]">
		<span class="item-title">Ahitagni Das</span>
		<div class="flex gap-[1.2em]">
			<a href="/publications" class="section-link">Publications</a>
			<a href="/essays" class="section-link">Essays</a>
			<a href="/reading" class="section-link">Shelf</a>
		</div>
	</div>

	<div class="flex items-start gap-4 pt-[20px]">
		<img src="/profile.webp" alt="" class="w-[150px] h-[150px] shrink-0 object-cover" draggable="false" />
		<div class="flex flex-col gap-[0.3em]">
			<p class="mt-0">
				I am the Founding Engineer at {@html link('https://optica.industries/', 'Optica Industries')},
				building the next American Metal Factory. We are backed by Lightspeed, SV Angel, & Neo.
			</p>
			<p>
				Previously, I worked on Humanoids at {@html link('https://personainc.ai/', 'Persona AI')}
				& researched Video Understanding at {@html link('https://www.sievedata.com/', 'Sieve Data')}
				to power Petabyte-scale video datasets for Frontier AI Labs.
			</p>
			<p>
				I am interested in World Modelling and
				{@html link('https://openreview.net/pdf?id=BZ5a1r-kVsf', 'JEPAs')}, advised by
				{@html link('https://scholar.google.com/citations?user=wwf-WgUAAAAJ&hl=en', 'Vivek Boominathan')},
				{@html link('https://scholar.google.com/citations?user=S1x_xqcAAAAJ&hl=en', 'Randall Balesteiero')}, &
				{@html link('https://scholar.google.com/citations?user=tI-oUmsAAAAJ&hl=en', 'Ashok Veeraraghavan')}.
				Before this, I've researched at the
				{@html link('https://www.media.mit.edu/groups/nano-cybernetic-biotrek/overview/', 'MIT Media Lab')} in Cambridge,
				{@html link('https://scholar.google.com/citations?user=S5oLGEgAAAAJ&hl=en', 'Ajayan Group')} at Rice, and
				{@html link('https://scholar.google.com/citations?user=JlmilbMAAAAJ&hl=en', 'IIT Guwahati')}.
			</p>
			<p>
				{@html link('/about', 'Here')} are some things I believe. I also like to {@html link('/reading', 'read')}
				and {@html link('https://www.ahidas.com/essays/', 'write')} about things that interest me.
			</p>
		</div>
	</div>

	<div class="pt-[20px]">
		<a href="/publications" class="item-title">Research</a>
		{#each displayItems as item}
			<ResearchItem {item} />
		{/each}
	</div>

	<div class="grid grid-cols-[7fr_3fr] pt-[20px]">
		<div>
			<p class="mb-0">I love to sail, travel, and take pictures</p>
			<p class="mb-0">Currently based in San Francisco.</p>
			<p class="mt-[1.2em] mb-0">ahitagnis [at] gmail [dot] com</p>
		</div>
		<div class="text-right">
			<p class="mb-0">{@html link('https://x.com/ahitagnied', 'Twitter', { external: true })}</p>
			<p class="mb-0">{@html link('https://www.linkedin.com/in/ahitagnid/', 'LinkedIn', { external: true })}</p>
			<p class="mt-[1.2em] mb-0">
				{@html link('https://scholar.google.com/citations?user=GLTc7LcAAAAJ&hl=en', 'Scholar', { external: true })}
			</p>
		</div>
	</div>

	<div class="flex justify-end items-center gap-[0.6em] pt-[20px] md:gap-[0.8em]">
		<p class="mb-0 text-right text-muted text-[length:var(--text-label)] md:text-[length:var(--text-caption)]">
			© 2023-2026 Ahitagni Das<br />Made in San Francisco
		</p>
		<img
			src="/stamp.webp"
			alt=""
			class="h-[50px] w-[50px] shrink-0 select-none pointer-events-none md:h-[60px] md:w-[60px]"
			draggable="false"
		/>
	</div>
</div>
