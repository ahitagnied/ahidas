import MarkdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import katex from 'katex';

const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true
}).use(markdownItFootnote);

/**
 * Render a markdown string to HTML.
 * Supports KaTeX ($$...$$  and $...$), footnotes, and standard markdown.
 * @param {string} source
 * @returns {string}
 */
export function renderMarkdown(source) {
	let processed = source;

	processed = processed.replace(
		/\$\$([\s\S]*?)\$\$/g,
		(/** @type {string} */ match, /** @type {string} */ math) => {
			try {
				return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
			} catch {
				return match;
			}
		}
	);

	processed = processed.replace(
		/\$([^$\n]+?)\$/g,
		(/** @type {string} */ match, /** @type {string} */ math) => {
			try {
				return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
			} catch {
				return match;
			}
		}
	);

	return md.render(processed);
}
