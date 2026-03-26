<script>
	import Icon from '@iconify/svelte';
	import ResearchItem from '$lib/components/ResearchItem.svelte';
	import EssayItem from '$lib/components/EssayItem.svelte';
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
		<div class="text-[15px] md:text-[17px] font-[500] text-body">Ahitagni D.</div>
		<div class="flex gap-4 text-[11px] md:text-[13px]">
			<a href="#about" class="text-secondary hover:text-body no-underline transition-colors">About</a>
			<a href="#contact" class="text-secondary hover:text-body no-underline transition-colors">Contact</a>
		</div>
	</div>

	<h1 id="about" class="pt-[25px]">ABOUT</h1>

	<p>
		I am the founding engineer at <a href="https://optica.industries/"
			>Optica Industries</a
		>, building the next American Metal Company. We are backed by 
		Lightspeed & Neo. If you are interested in joining,
		<a href="https://calendly.com/ahitagnid/new-meeting">reach out</a>.
	</p>

	<p>
		I am a part of <a href="https://neo.com/">Neo</a> and scout
		pre-seed startups for <a href="https://www.clayvc.io/">Clay VC</a>. Previously, 
		I worked on Robot Learning and MLOps at <a href="https://personainc.ai/"
		>Persona AI</a> to build Industrial Humanoids and researched Video 
		Understanding at <a href="https://www.sievedata.com/">Sieve Data</a> that powered
		Petabyte-scale video datasets for Frontier AI Labs.
	</p>

	<p>
		My current research interest is World Modelling, particularly 
		using <a href="https://openreview.net/pdf?id=BZ5a1r-kVsf">JEPAs</a>. 
		I research Multimodal JEPAs, 3D Vision, & Computational Imaging with 
		<a href="https://scholar.google.com/citations?user=S1x_xqcAAAAJ&hl=en"> 
		Randall Balesteiero</a> and <a
			href="https://vivekboominathan.com/"
			>Vivek Boominathan</a
		>. Previously, I worked on Colloidal Robotics at the
		<a
			href="https://www.media.mit.edu/groups/nano-cybernetic-biotrek/overview/"
			>MIT Media Lab</a
		>, and Li/Na-ion batteries at the
		<a href="https://ajayan.rice.edu/">Ajayan Group</a> &
		<a href="https://scholar.google.com/citations?user=JlmilbMAAAAJ&hl=en"
			>IIT Guwahati</a
		>.
	</p>

	<p>
		Grew up in Kolkata wanting to be a Theoretical Physicist — turns out building
		things is just as fun. When I'm not, I'm sailing, hiking or traveling somewhere new.
	</p>

	<h1 class="pt-[25px]">
		<a href="/research" class="section-link group">
			Research
			<Icon icon="mdi:arrow-top-right" class="arrow-icon-right" />
		</a>
	</h1>

	{#each displayItems as item (item.title)}
		<ResearchItem {item} />
	{/each}

	<h1 class="pt-[25px]">
		<a href="/essays" class="section-link group">
			Essays
			<Icon icon="mdi:arrow-top-right" class="arrow-icon-right" />
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
		<a href="https://github.com/ahitagnied" target="_blank" rel="noopener noreferrer">GitHub</a>, and
		<a href="https://linkedin.com/in/ahitagnid" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
	</p>

	<div class="flex justify-end mt-[1.2em]">
		<img
			src="/images/stamp.webp"
			alt="Stamp"
			class="h-[50px] md:h-[60px] w-auto select-none block"
			draggable="false"
		/>
	</div>
</div>
