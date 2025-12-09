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
			color: #374151;
			font-size: 13px;
		}
		.prose a {
			text-decoration: none;
		}
		.prose :is(h1, h2, h3, h4) {
			color: #1f2937;
			font-weight: 500;
		}
		.prose h1 {
			font-size: 16px;
			margin: 40px 0 20px;
		}
		.prose h2 {
			font-size: 15px;
			margin: 32px 0 16px;
		}
		.prose h3 {
			font-size: 14px;
			margin: 24px 0 12px;
		}
		.prose h4 {
			font-size: 12px;
			margin: 16px 0 8px;
		}
		.prose hr {
			display: none;
		}

		.prose .footnotes {
			margin-top: 24px;
			padding-top: 12px;
			border-top: 1px solid #d1d5db;
		}
		.prose .footnotes ol {
			list-style: none;
			counter-reset: footnote;
			padding: 0;
			margin: 0;
		}
		.prose .footnotes li {
			font-size: 11px;
			color: rgb(36, 38, 42);
			counter-increment: footnote;
			margin: 0;
			line-height: 1.4;
		}
		.prose .footnotes li + li {
			margin-top: 2px;
		}
		.prose .footnotes li::before {
			content: '[' counter(footnote) ']';
			font-size: 8px;
			vertical-align: super;
			margin-right: 4px;
		}
		.prose .footnotes li p {
			display: inline;
		}
		.prose sup {
			font-size: 10px;
			color: rgb(24, 27, 32);
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
				font-size: 15px;
			}
			.prose h1 {
				font-size: 18px;
			}
			.prose h2 {
				font-size: 17px;
			}
			.prose h3 {
				font-size: 16px;
			}
			.prose h4 {
				font-size: 14px;
			}
		}
	</style>
</svelte:head>

<div class="page-container">
	<a href="/essays" class="back-link mb-4 group">
		<Icon icon="mdi:arrow-bottom-left" class="arrow-icon-left" />
		Back
	</a>

	<div class="mb-6">
		<div class="text-[16px] md:text-[18px] font-medium text-gray-600 mb-1">
			{title}
		</div>
		<div class="text-gray-400 text-[12px]">{date}</div>
	</div>

	<div class="prose prose-sm max-w-none">
		{@html htmlContent}
	</div>
</div>
