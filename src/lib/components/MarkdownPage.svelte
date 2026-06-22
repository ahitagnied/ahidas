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
	<div class="mb-6">
		<div class="item-title">
			<a href={backHref} class="no-underline" style="color: inherit">Ahitagni Das</a>
			<span class="text-muted"> — {title}</span>
		</div>
		{#if date}
			<div class="text-muted text-[length:var(--text-label)] mt-1">{date}</div>
		{/if}
	</div>

	<div class="prose prose-sm max-w-none">
		{@html htmlContent}
	</div>
</div>
