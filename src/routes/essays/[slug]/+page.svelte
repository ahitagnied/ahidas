<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import MarkdownIt from 'markdown-it';
	import markdownItFootnote from 'markdown-it-footnote';
	import katex from 'katex';
	import { getEssayBySlug } from '$lib/utils/essays.js';

	const slug = $page.params.slug;

	const md = new MarkdownIt({
		html: true,
		linkify: true,
		typographer: true
	}).use(markdownItFootnote);

	const essay = getEssayBySlug(slug);

	if (!essay) {
		throw new Error(`Essay not found: ${slug}`);
	}

	const { title, date, content: text } = essay;
	const markdownContent = text.replace(/^---\n[\s\S]*?\n---\n/, '');

	let processedContent = markdownContent;

	processedContent = processedContent.replace(
		/\$\$([\s\S]*?)\$\$/g,
		(match, math) => {
			try {
				return katex.renderToString(math.trim(), {
					displayMode: true,
					throwOnError: false
				});
			} catch {
				return match;
			}
		}
	);

	processedContent = processedContent.replace(
		/\$([^$\n]+?)\$/g,
		(match, math) => {
			try {
				return katex.renderToString(math.trim(), {
					displayMode: false,
					throwOnError: false
				});
			} catch {
				return match;
			}
		}
	);

	const htmlContent = md.render(processedContent);
</script>

<svelte:head>
	<title>{title} | Ahitagni D</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
	/>
	<style>
		.prose {
			color: var(--color-text);
			font-size: var(--text-body);
		}
		.prose a {
			text-decoration: none;
		}
		.prose :is(h1, h2) {
			color: var(--color-text-hover);
			font-weight: 500;
		}
		.prose h1 {
			font-size: var(--text-title);
			margin: 40px 0 20px;
		}
		.prose h2 {
			font-size: var(--text-lead);
			margin: 32px 0 16px;
		}
		.prose hr {
			display: none;
		}

		.prose .footnotes {
			margin-top: 24px;
			padding-top: 12px;
			border-top: 1px solid var(--color-border);
		}
		.prose .footnotes ol {
			list-style: none;
			counter-reset: footnote;
			padding: 0;
			margin: 0;
		}
		.prose .footnotes li {
			font-size: var(--text-label);
			color: var(--color-text);
			counter-increment: footnote;
			margin: 0;
			line-height: 1.4;
		}
		.prose .footnotes li + li {
			margin-top: 2px;
		}
		.prose .footnotes li::before {
			content: '[' counter(footnote) ']';
			font-size: var(--text-micro);
			vertical-align: super;
			margin-right: 4px;
		}
		.prose .footnotes li p {
			display: inline;
		}
		.prose sup {
			font-size: var(--text-micro);
			color: var(--color-text);
		}

		.prose .katex-display {
			overflow-x: auto;
			overflow-y: hidden;
			max-width: 100%;
			margin: 1em 0;
			padding: 0.5em 0;
		}

		@media (min-width: 768px) {
			.prose {
				font-size: var(--text-lead);
			}
			.prose h1 {
				font-size: var(--text-display);
			}
			.prose h2 {
				font-size: var(--text-display);
			}
		}
	</style>
</svelte:head>

<div class="page-container">
	<a href="/essays" class="back-link mb-4 group">
		<Icon icon="mdi:arrow-bottom-left" class="arrow-icon" />
		Back
	</a>

	<div class="mb-6">
		<div class="mb-1 font-[500] text-body text-[length:var(--text-lead)] md:text-[length:var(--text-display)]">
			{title}
		</div>
		<div class="text-muted text-[length:var(--text-label)]">{date}</div>
	</div>

	<div class="prose prose-sm max-w-none">
		{@html htmlContent}
	</div>
</div>
