<script>
	/** @type {string} */
	export let title;
	/** @type {string} */
	export let htmlContent;
	/** @type {string | undefined} */
	export let date = undefined;
	/** @type {string | undefined} */
	export let section = undefined;
</script>

<svelte:head>
	<title>{title} | Ahitagni D</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
</svelte:head>

<div class="page-container">
	<div class="mb-6">
		<div class="mb-[1.2em] item-title">
			<a href="/" class="no-underline" style="color: inherit">Ahitagni Das</a>{#if section}<span class="text-muted">{' — '}</span><a href="/{section.toLowerCase()}" class="no-underline" style="color: var(--color-text-muted)">{section}</a>{:else}<span class="text-muted">{' — '}{title}</span>{/if}
		</div>
		{#if section}
			<div class="mb-1 font-[500] item-title text-[length:var(--text-lead)] md:text-[length:var(--text-display)]">
				{title}
			</div>
			{#if date}
				<div class="text-muted text-[length:var(--text-caption)] md:text-[length:var(--text-caption-md)]">{date}</div>
			{/if}
		{/if}
	</div>

	<div class="prose prose-sm max-w-none">
		{@html htmlContent}
	</div>
</div>
