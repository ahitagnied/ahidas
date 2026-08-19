<script>
	import { link } from '$lib/utils/refLink.js';
</script>

<svelte:head>
	<title>Ahitagni D | Home</title>
</svelte:head>

<div class="page-container">
	<div class="mb-[1.2em] flex items-baseline justify-between gap-[1.5em]">
		<div class="item-title text-[color:var(--color-text-hover)]">Ahitagni Das</div>
		<div class="link-accent flex shrink-0 gap-[1em]">
			{@html link('/publications', 'Publications')}
			{@html link('/essays', 'Essays')}
		</div>
	</div>

	<div class="flex flex-col gap-[0.3em] pt-[20px]">
		<p class="mt-0">
			I am the Founding Engineer at {@html link('https://optica.industries/', 'Optica Industries')},
			where I lead ML & Perception. We are backed by Addition, LSVP, & Neo.
		</p>
		<p>
			I enjoy {@html link('/publications', 'research')} and am interested in improving
			{@html link('https://openreview.net/pdf?id=BZ5a1r-kVsf', 'JEPA')} & WMs for Robotics. I am advised by
			{@html link('https://scholar.google.com/citations?user=wwf-WgUAAAAJ&hl=en', 'Vivek Boominathan')},
			{@html link('https://scholar.google.com/citations?user=S1x_xqcAAAAJ&hl=en', 'Randall Balestriero')}, &
			{@html link('https://scholar.google.com/citations?user=tI-oUmsAAAAJ&hl=en', 'Ashok Veeraraghavan')}.
		</p>
		<p>
			Previously, I worked on Humanoids at {@html link('https://personainc.ai/', 
			'Persona AI')}, Multimodal Intelligence at {@html link('https://www.sievedata.com/', 'Sieve')},
			and Chip Design + Nano-electronics at the
			{@html link('https://www.media.mit.edu/groups/nano-cybernetic-biotrek/overview/', 'MIT Media Lab')},
			{@html link('https://scholar.google.com/citations?user=S5oLGEgAAAAJ&hl=en', 'Ajayan Group')}, &
			{@html link('https://scholar.google.com/citations?user=JlmilbMAAAAJ&hl=en', 'IIT Guwahati')}.
		</p>
		<p>
			{@html link('/about', 'Here')} is more about me. I am also on
			{@html link('https://scholar.google.com/citations?user=GLTc7LcAAAAJ&hl=en', 'Scholar', { external: true })}
			& {@html link('https://x.com/ahitagnied', 'Twitter', { external: true })}.
		</p>
	</div>
</div>
