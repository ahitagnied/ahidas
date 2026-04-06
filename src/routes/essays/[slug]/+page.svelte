<script>
	import { page } from '$app/stores';
	import ProsePage from '$lib/components/ProsePage.svelte';
	import { renderMarkdown } from '$lib/utils/markdown.js';
	import { getEssayBySlug } from '$lib/utils/essays.js';

	const essay = getEssayBySlug($page.params.slug);

	if (!essay) {
		throw new Error(`Essay not found: ${$page.params.slug}`);
	}

	const { title, date, body } = essay;
	const htmlContent = renderMarkdown(body);
</script>

<ProsePage {title} {date} backHref="/essays" {htmlContent} katex />
