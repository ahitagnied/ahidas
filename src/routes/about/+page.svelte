<script>
	import aboutText from '$lib/data/about.md?raw';
	import { renderMarkdown } from '$lib/utils/markdown.js';
	import MarkdownPage from '$lib/components/MarkdownPage.svelte';

	const htmlContent = renderMarkdown(aboutText);
</script>

<MarkdownPage title="About" backHref="/" {htmlContent} />
