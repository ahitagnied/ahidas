export function loadBooks() {
	const bookModules = import.meta.glob('$lib/data/books/*.md', {
		query: '?raw',
		eager: true
	});

	return Object.entries(bookModules).map(([path, content]) => {
		const slug = path.split('/').pop()?.replace('.md', '') || '';
		const text = /** @type {any} */ (content)?.default || content;
		
		const frontmatterMatch = /** @type {string} */ (text).match(/^---\n([\s\S]*?)\n---/);
		
		if (!frontmatterMatch) {
			console.warn(`Failed to parse frontmatter for ${slug}`);
			return { slug, title: slug, spineColor: '', textColor: '', coverImage: '', author: '', read: '', rating: '', description: '' };
		}

		const frontmatter = frontmatterMatch[1];
		const body = text.substring(frontmatterMatch[0].length).trim();

		/** @type {Record<string, string>} */
		const metadata = {};
		frontmatter.split('\n').forEach(line => {
			const colonIndex = line.indexOf(':');
			if (colonIndex === -1) return;
			const key = line.substring(0, colonIndex).trim();
			let value = line.substring(colonIndex + 1).trim();
			if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
				value = value.slice(1, -1);
			}
			metadata[key] = value;
		});

		return {
			slug,
			title: metadata.title || slug,
			spineColor: metadata.spineColor || '',
			textColor: metadata.textColor || '',
			coverImage: metadata.coverImage || '',
			author: metadata.author || '',
			read: metadata.read || '',
			rating: metadata.rating || '',
			description: body || ''
		};
	}).sort((a, b) => {
		if (!a.read || !b.read) return 0;
		const dateA = new Date(a.read);
		const dateB = new Date(b.read);
		return dateB.getTime() - dateA.getTime();
	});
}

export function getBookBySlug(/** @type {string} */ slug) {
	const books = loadBooks();
	return books.find((book) => book.slug === slug);
}
