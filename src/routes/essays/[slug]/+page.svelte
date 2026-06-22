<script>
	import { page } from '$app/stores';
	import { getEssayBySlug } from '$lib/utils/essays.js';
	import { renderMarkdown } from '$lib/utils/markdown.js';
	import MarkdownPage from '$lib/components/MarkdownPage.svelte';

	const essay = getEssayBySlug($page.params.slug);

	if (!essay) {
		throw new Error(`Essay not found: ${$page.params.slug}`);
	}

	const htmlContent = renderMarkdown(essay.content);
</script>

<MarkdownPage
	title={essay.title}
	date={essay.date}
	section="Essays"
	{htmlContent}
/>
