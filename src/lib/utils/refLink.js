/**
 * @param {string} href
 * @param {string} text
 * @param {{ external?: boolean }} [options]
 * @returns {string}
 */
export function link(href, text, options = {}) {
	const { external = false } = options;
	const externalAttrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
	return `<a href="${href}"${externalAttrs}>${text}</a>`;
}
