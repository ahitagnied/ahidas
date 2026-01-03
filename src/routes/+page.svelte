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
		<div class="text-[16px] md:text-[18px] font-medium text-gray-00">
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

		<div class="text-[12px] md:text-[14px]">adas [at] rice [dot] edu</div>

		<div></div>
	</div>

	<div class="separator"></div>

	<h1>ABOUT</h1>

	<p>
		I am the founding engineer at <a href="https://optica.industries/"
			>Optica Industries</a
		>, leading Thorin and Kili - our CV platforms to solve the information asymmetry 
		problem in the American Metal Industry. We are backed by Lightspeed & Neo. If you
		are interested in joining,
		<a href="https://calendly.com/ahitagnid/new-meeting">reach out</a>.
	</p>

	<p>
		I love ML and consumer AI exploring new ways to interact with reality &
		imagination. I am a part of <a href="https://neo.com/">Neo</a> and scout
		for <a href="https://www.clayvc.io/">Clay VC</a> where we invest as early
		as possible. Clay was among the first investors
		<a href="https://elevenlabs.io/">Eleven Labs</a> &
		<a href="https://mistral.ai/">Mistral AI</a>.
	</p>

	<p>
		Previously, I worked on Robot Learning and MLOps at <a href="https://personainc.ai/"
		>Persona AI</a>. Persona is building Industrial Humanoids, starting with 
		welding in shipyards for HD Hyundai. Before that, I researched Video 
		Understanding at <a href="https://www.sievedata.com/">Sieve Data</a> to build 
		Petabyte-scale Video Datasets for Frontier AI Labs.
	</p>

	<p>
		My current interests in research are 3D Vision & World Modelling, particularly 
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
		>, researched Li/Na-ion batteries at the
		<a href="https://ajayan.rice.edu/">Ajayan Group</a>, and energy devices at
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
