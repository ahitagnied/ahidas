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

/**
 * @param {string} href
 * @param {number | string} number
 * @returns {string}
 */
export function refLink(href, number) {
	return `<a href="${href}" class="no-underline"><sup>[${number}]</sup></a>`;
}
