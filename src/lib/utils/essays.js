export function loadEssays() {
	const essayModules = import.meta.glob('$lib/data/essays/*.md', {
		query: '?raw',
		eager: true
	});

	return Object.entries(essayModules).map(([path, content]) => {
		const slug = path.split('/').pop()?.replace('.md', '') || '';
		const text = /** @type {any} */ (content)?.default || content;
		const [, frontmatter] =
			/** @type {string} */ (text).match(/^---\n([\s\S]*?)\n---/) || [];

		return {
			slug,
			title: frontmatter?.match(/title:\s*(.+)/)?.[1]?.trim() || slug,
			date: frontmatter?.match(/date:\s*(.+)/)?.[1]?.trim() || '',
			published:
				frontmatter?.match(/published:\s*(.+)/)?.[1]?.trim() === 'true',
			content: text
		};
	});
}

export function getPublishedEssays() {
	return loadEssays().filter((essay) => essay.published !== false);
}

export function getEssayBySlug(/** @type {string} */ slug) {
	const essays = loadEssays();
	return essays.find((essay) => essay.slug === slug);
}
