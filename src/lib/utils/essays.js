export function loadEssays() {
	const modules = import.meta.glob('$lib/data/essays/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	return Object.entries(modules).map(([path, content]) => {
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const text = /** @type {string} */ (content);
		const [, frontmatter] = text.match(/^---\n([\s\S]*?)\n---/) ?? [];

		return {
			slug,
			title: frontmatter?.match(/title:\s*(.+)/)?.[1]?.trim() ?? slug,
			date: frontmatter?.match(/date:\s*(.+)/)?.[1]?.trim() ?? '',
			published: frontmatter?.match(/published:\s*(.+)/)?.[1]?.trim() === 'true',
			image: frontmatter?.match(/image:\s*(.+)/)?.[1]?.trim() ?? '',
			body: text.replace(/^---\n[\s\S]*?\n---\n/, '')
		};
	});
}

export function getPublishedEssays() {
	return loadEssays().filter((essay) => essay.published);
}

export function getEssayBySlug(/** @type {string} */ slug) {
	return loadEssays().find((essay) => essay.slug === slug);
}
