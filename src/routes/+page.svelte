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
	<div class="grid">
		<div class="text-[15px] md:text-[17px] font-medium text-gray-00">
			Ahitagni D.
		</div>

		<div class="flex gap-2 items-center justify-end">
			<a
				href="https://github.com/ahitagnied"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-600 hover:text-gray-800"
				aria-label="GitHub"
			>
				<Icon icon="mdi:github" class="w-6 h-6" />
			</a>
			<a
				href="https://linkedin.com/in/ahitagnid"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-600 hover:text-gray-800"
				aria-label="LinkedIn"
			>
				<Icon icon="mdi:linkedin" class="w-6 h-6" />
			</a>
			<a
				href="https://x.com/ahitagnied"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-600 hover:text-gray-800"
				aria-label="Twitter"
			>
				<Icon icon="mdi:twitter" class="w-6 h-6" />
			</a>
		</div>

		<div class="text-[11px] md:text-[13px]">adas [at] rice [dot] edu</div>

		<div></div>
	</div>

	<div class="separator"></div>

	<h1>ABOUT</h1>

	<p>
		I am the founding engineer at <a href="https://optica.industries/"
			>Optica Industries</a
		>, helping build the next American Metal Industry. We are backed by 
		Lightspeed & Neo. If you are interested in joining,
		<a href="https://calendly.com/ahitagnid/new-meeting">reach out</a>.
	</p>

	<p>
		I am a part of <a href="https://neo.com/">Neo</a> and scout
		pre-seed startups for <a href="https://www.clayvc.io/">Clay VC</a>. Previously, 
		I worked on Robot Learning and MLOps at <a href="https://personainc.ai/"
		>Persona AI</a> to build Industrial Humanoids and researched Video 
		Understanding powering Petabyte-scale Video Datasets for Frontier AI Labs
		 at <a href="https://www.sievedata.com/">Sieve Data</a>.
	</p>

	<p>
		My current research interest is World Modelling, particularly 
		using <a href="https://openreview.net/pdf?id=BZ5a1r-kVsf">JEPAs</a>. 
		I research Multimodal JEPAs with 
		<a href="https://scholar.google.com/citations?user=S1x_xqcAAAAJ&hl=en">Dr. 
		Randall Balesteiero</a> and Gaussian Splatting at the <a
			href="https://computationalimaging.rice.edu/"
			>Computational Imaging Group</a
		>. Previously, I worked on Colloidal Robotics at the
		<a
			href="https://www.media.mit.edu/groups/nano-cybernetic-biotrek/overview/"
			>MIT Media Lab</a
		>, and Li/Na-ion batteries at the
		<a href="https://ajayan.rice.edu/">Ajayan Group</a>, and
		<a href="https://scholar.google.com/citations?user=JlmilbMAAAAJ&hl=en"
			>IIT Guwahati</a
		>.
	</p>

	<div class="separator"></div>

	<h1>
		<a href="/research" class="section-link group">
			Research
			<Icon icon="mdi:arrow-top-right" class="arrow-icon-right" />
		</a>
	</h1>

	{#each displayItems as item (item.title)}
		<ResearchItem {item} />
	{/each}

	<div class="separator"></div>

	<h1>
		<a href="/essays" class="section-link group">
			Essays
			<Icon icon="mdi:arrow-top-right" class="arrow-icon-right" />
		</a>
	</h1>

	{#each displayEssays as essay (essay.slug)}
		<EssayItem item={essay} />
	{/each}
</div>
