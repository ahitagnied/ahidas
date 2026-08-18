<script>
	import { link } from '$lib/utils/refLink.js';
</script>

<svelte:head>
	<title>Ahitagni D | Home</title>
</svelte:head>

<div class="page-container">
	<div class="mb-[1.2em]">
		<div class="item-title text-[color:var(--color-text-hover)]">Ahitagni Das</div>
		<div class="text-muted">adas [at] rice [.] edu</div>
	</div>

	<div class="flex flex-col gap-[0.3em] pt-[20px]">
		<p class="mt-0">
			I am the Founding Engineer at {@html link('https://optica.industries/', 'Optica Industries')},
			where I lead ML and Perception. We are backed by Addition, Lightspeed, & Neo.
		</p>
		<p>
			I enjoy research and am interested in improving
			{@html link('https://openreview.net/pdf?id=BZ5a1r-kVsf', 'JEPA')} through Physics Understanding
			and Hierarchical Abstraction. I am advised by
			{@html link('https://scholar.google.com/citations?user=wwf-WgUAAAAJ&hl=en', 'Vivek Boominathan')},
			{@html link('https://scholar.google.com/citations?user=S1x_xqcAAAAJ&hl=en', 'Randall Balestriero')}, and
			{@html link('https://scholar.google.com/citations?user=tI-oUmsAAAAJ&hl=en', 'Ashok Veeraraghavan')}.
		</p>
		<p>
			Before this, I spent about a year working on Humanoids at {@html link('https://personainc.ai/', 
			'Persona AI')} and Multimodal Intelligence at {@html link('https://www.sievedata.com/', 'Sieve')}.
			I've also worked on Chip Design, Nano Neuro-electronics, and  Energy at the
			{@html link('https://www.media.mit.edu/groups/nano-cybernetic-biotrek/overview/', 'MIT Media Lab')},
			{@html link('https://scholar.google.com/citations?user=S5oLGEgAAAAJ&hl=en', 'Ajayan Group')}, and
			{@html link('https://scholar.google.com/citations?user=JlmilbMAAAAJ&hl=en', 'IIT Guwahati')}.
		</p>
		<p>
			{@html link('/about', 'Here')} are some things I believe. I also like to
			{@html link('/essays', 'write')} about things that interest me, sail, travel, and take pictures.
		</p>
	</div>

	<div class="flex gap-[1.5em] pt-[20px]">
		<div class="link-accent flex flex-col items-start">
			{@html link('/about', 'About')}
			{@html link('/publications', 'Publications')}
			{@html link('/essays', 'Essays')}
		</div>
		<div class="flex flex-col items-start">
			{@html link('https://www.linkedin.com/in/ahitagnid/', 'LinkedIn', { external: true })}
			{@html link('https://scholar.google.com/citations?user=GLTc7LcAAAAJ&hl=en', 'Scholar', { external: true })}
			{@html link('https://x.com/ahitagnied', 'Twitter', { external: true })}
		</div>
	</div>
</div>
