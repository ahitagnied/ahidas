<script>
	import ProsePage from '$lib/components/ProsePage.svelte';
	import { renderMarkdown } from '$lib/utils/markdown.js';
	import source from '$lib/data/about.md?raw';

	const htmlContent = renderMarkdown(source);
</script>

<ProsePage title="About" backHref="/" {htmlContent} />
