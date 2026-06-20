<script>
	import Icon from '@iconify/svelte';

	/** @type {string} */
	export let title;
	/** @type {string} */
	export let backHref;
	/** @type {string} */
	export let htmlContent;
	/** @type {string | undefined} */
	export let date = undefined;
</script>

<svelte:head>
	<title>{title} | Ahitagni D</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
</svelte:head>

<div class="page-container">
	<div class="mb-4">
		<a href={backHref} class="back-link group">
			<Icon icon="mdi:arrow-bottom-left" class="arrow-icon" />
			Back
		</a>
	</div>

	<div class="mb-6">
		<div class="mb-1 font-[500] text-body text-[length:var(--text-lead)] md:text-[length:var(--text-display)]">
			{title}
		</div>
		{#if date}
			<div class="text-muted text-[length:var(--text-label)]">{date}</div>
		{/if}
	</div>

	<div class="prose prose-sm max-w-none">
		{@html htmlContent}
	</div>
</div>
