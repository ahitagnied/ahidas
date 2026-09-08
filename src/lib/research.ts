import data from './research.yaml';

export type Paper = {
	title: string;
	description: string;
	image: string;
	venue?: string;
	links?: Record<string, string>;
};

export const papers = data as Paper[];

const linkOrder = ['arXiv', 'paper', 'code', 'website'];

export function orderedLinks(links: Record<string, string> = {}): [string, string][] {
	const rank = (label: string) => {
		const i = linkOrder.indexOf(label);
		return i === -1 ? linkOrder.length : i;
	};
	return Object.entries(links)
		.filter(([, url]) => url)
		.sort(([a], [b]) => rank(a) - rank(b));
}

export function isVideo(url: string): boolean {
	return /\.(mp4|webm|mov)$/i.test(url);
}

export function isUrl(value: string): boolean {
	return URL.canParse(value);
}

/** Falls back to the raw value for placeholders like "[soon]". */
export function linkText(url: string): string {
	if (!isUrl(url)) return url;

	const { hostname, pathname } = new URL(url);
	const host = hostname.replace(/^www\./, '');
	const segments = pathname.split('/').filter(Boolean);

	if (host === 'github.com' && segments.length >= 2) {
		return `${segments[0]}/${segments[1].replace(/\.git$/, '')}`;
	}

	if (host === 'arxiv.org' && segments.length) {
		return segments[segments.length - 1].replace(/\.pdf$/, '');
	}

	return host;
}
