import MarkdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import katex from 'katex';

const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true
}).use(markdownItFootnote);

/**
 * @param {string} text - Raw markdown string (may include frontmatter)
 * @returns {string} Rendered HTML
 */
export function renderMarkdown(text) {
	const stripped = text.replace(/^---\n[\s\S]*?\n---\n/, '');

	const withMath = stripped
		.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
			try {
				return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
			} catch {
				return match;
			}
		})
		.replace(/\$([^$\n]+?)\$/g, (match, math) => {
			try {
				return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
			} catch {
				return match;
			}
		});

	return md.render(withMath);
}
