<script>
	import Icon from '@iconify/svelte';
	import ResearchItem from '$lib/components/ResearchItem.svelte';
	import EssayItem from '$lib/components/EssayItem.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import researchData from '$lib/data/research.yml?raw';
	import yaml from 'js-yaml';
	import { getPublishedEssays } from '$lib/utils/essays.js';

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
			class="font-[500] text-[1rem] md:text-[1.125rem]"
		>
			Hi, I am Ahitagni!
		</div>
		<ThemeToggle />
	</div>

	<h1 id="about" class="pt-[25px]">ABOUT</h1>

	<p>
		I am the Founding Engineer at <a href="https://optica.industries/">Optica Industries</a>,
		building the next American Metal Factory. We are backed by Lightspeed, SV Angel, & Neo.
	</p>

	<p>
		I am a part of <a href="https://neo.com/">Neo</a> & scout for
		<a href="https://www.clayvc.io/">Clay VC</a>. Previously, I worked on Robot Learning for
		Industrial Humanoids at <a href="https://personainc.ai/">Persona AI</a> & researched Video
		Understanding at <a href="https://www.sievedata.com/">Sieve Data</a> that powered
		Petabyte-scale video datasets for Frontier AI Labs.
	</p>

	<p>
		My current research interest is World Modelling &
		<a href="https://openreview.net/pdf?id=BZ5a1r-kVsf">JEPAs</a>.
		I research Multimodal JEPAs, 3D Vision, & Imaging with
		<a href="https://scholar.google.com/citations?user=S1x_xqcAAAAJ&hl=en">Randall Balesteiero</a>,
		<a href="https://vivekboominathan.com/">Vivek Boominathan</a>, &
		<a href="https://computationalimaging.rice.edu/team/ashok-veeraraghavan/">Ashok Veeraradhavan</a>.
		Previously, I worked on Colloidal Robotics & Nanoelectronics at the
		<a href="https://www.media.mit.edu/groups/nano-cybernetic-biotrek/overview/">MIT Media Lab</a>,
		<a href="https://ajayan.rice.edu/">Ajayan Group</a> &
		<a href="https://scholar.google.com/citations?user=JlmilbMAAAAJ&hl=en">IIT Guwahati</a>.
	</p>

	<p>
		<a href="/about">Here</a> is a longer informal bio. I also like to <a href="/reading">read</a>
		and <a href="https://www.ahidas.com/essays/">write</a> about things that interest me.
	</p>

	<h1 class="pt-[25px]">
		<a href="/research" class="section-link group">
			Research
			<Icon icon="mdi:arrow-top-right" class="arrow-icon" />
		</a>
	</h1>

	{#each displayItems as item (item.title)}
		<ResearchItem {item} />
	{/each}

	<h1 class="pt-[25px]">
		<a href="/essays" class="section-link group">
			Essays
			<Icon icon="mdi:arrow-top-right" class="arrow-icon" />
		</a>
	</h1>

	{#each displayEssays as essay (essay.slug)}
		<EssayItem item={essay} />
	{/each}

	<h1 id="contact" class="pt-[25px]">CONTACT</h1>

	<p>
		I am easy to reach — book a <a href="https://calendly.com/ahitagnid/new-meeting">meeting</a>
		with a short blurb about what you want to talk about, or write to me at
		adas [at] rice [dot] edu. I am also on
		<a href="https://x.com/ahitagnied" target="_blank" rel="noopener noreferrer">Twitter</a>,
		<a href="https://github.com/ahitagnied" target="_blank" rel="noopener noreferrer">GitHub</a>, &
		<a href="https://linkedin.com/in/ahitagnid" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
	</p>

</div>
