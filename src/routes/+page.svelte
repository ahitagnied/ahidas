<script>
	import Icon from '@iconify/svelte';
	import ResearchItem from '$lib/components/ResearchItem.svelte';
	import EssayItem from '$lib/components/EssayItem.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import researchData from '$lib/data/research.yml?raw';
	import yaml from 'js-yaml';
	import { getPublishedEssays } from '$lib/utils/essays.js';
	import { link, refLink } from '$lib/utils/refLink.js';

	const researchItems = yaml.load(researchData);
	const displayItems = researchItems.slice(0, 5);

	const essays = getPublishedEssays();
	const displayEssays = essays.slice(0, 5);
</script>

<svelte:head>
	<title>Ahitagni D | Home</title>
</svelte:head>

<div class="page-container">
	<div class="flex justify-between items-center mb-3">
		<div
			class="font-[500] text-body text-[length:var(--text-lead)] md:text-[length:var(--text-display)]"
		>
			Hi! I am Ahi
		</div>
		<ThemeToggle />
	</div>

	<p class="pt-[20px]">
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
		{@html link('https://vivekboominathan.com/', 'Vivek Boominathan')},
		{@html link('https://scholar.google.com/citations?user=S1x_xqcAAAAJ&hl=en', 'Randall Balesteiero')}, &
		{@html link('https://computationalimaging.rice.edu/team/ashok-veeraraghavan/', 'Ashok Veeraraghavan')}. Before this, I've researched at the
		{@html link('https://www.media.mit.edu/groups/nano-cybernetic-biotrek/overview/', 'MIT Media Lab')} in Cambridge,
		{@html link('https://ajayan.rice.edu/', 'Ajayan Group')} at Rice, and
		{@html link('https://scholar.google.com/citations?user=JlmilbMAAAAJ&hl=en', 'IIT Guwahati')}.
	</p>

	<p>
		{@html link('/about', 'Here')} are some things I believe. I also like to {@html link('/reading', 'read')}
		and {@html link('https://www.ahidas.com/essays/', 'write')} about things that interest me.
	</p>

	<h1 class="pt-[20px]">
		<a href="/research" class="section-link group">
			Research
			<Icon icon="mdi:arrow-top-right" class="arrow-icon" />
		</a>
	</h1>

	{#each displayItems as item (item.title)}
		<ResearchItem {item} />
	{/each}

	<h1 class="pt-[20px]">
		<a href="/essays" class="section-link group">
			Essays
			<Icon icon="mdi:arrow-top-right" class="arrow-icon" />
		</a>
	</h1>

	{#each displayEssays as essay (essay.slug)}
		<EssayItem item={essay} />
	{/each}

	<img src="/denali.webp" alt="" class="w-full my-2" />

	<h1 class="pt-[20px]">
		Interests
	</h1>

	<p>
		Robots will soon automate most of the physical world. Many models are
		already proving to be useful enough for deployment. This posits a
		reality where deployment & foundational model research can
		symbiotically accelerate each other.
	</p>
	<p>
		The key is models that understand the world. I am interested 
		in robotic manipulation, particularly using JEPAs and action-conditioned 
		WM approaches to VLA.{@html refLink('https://le-wm.github.io/', 1)}
	</p>
	<p>
		I am generally interested in startups,{@html refLink('https://www.ahidas.com/about', 2)}
		especially ones building and  deploying embodied AI. Many physical industries 
		are yet to realise what recent learning-based methods make possible.
	</p>
	<p>
		A new wave of reindustrialisation,{@html refLink('https://optica.industries/', 3)}
		where AI moves beyond software and starts reshaping how the physical world is built,
		operated, and automated is underway. If you are building in this space,
		{@html link('https://calendly.com/ahitagnid/new-meeting', 'would love to chat')}.
	</p>

	<div class="grid grid-cols-2 pt-[20px]">
		<div>
			<p class="mb-0">I love to sail, travel, and take pictures</p>
			<p class="mb-0">Currently based in San Francisco.</p>
			<p class="mt-[1.2em] mb-0">ahitagnis [at] gmail [dot] com</p>
		</div>
		<div class="text-right">
			<p class="mb-0">{@html link('https://x.com/ahitagnied', 'Twitter', { external: true })}</p>
			<p class="mb-0">{@html link('https://www.linkedin.com/in/ahitagnid/', 'LinkedIn', { external: true })}</p>
			<p class="mt-[1.2em] mb-0">
				{@html link('https://scholar.google.com/citations?user=GLTc7LcAAAAJ&hl=en', 'Google Scholar', { external: true })}
			</p>
		</div>
	</div>
</div>
