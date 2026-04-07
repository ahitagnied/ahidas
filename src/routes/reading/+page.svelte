<script>
	import Icon from '@iconify/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import booksData from '$lib/data/books.yml?raw';
	import yaml from 'js-yaml';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	const books = yaml.load(booksData);
	const sortedBooks = [...books].sort((a, b) => b.rating - a.rating);

	let bookIndex = -1;
	let scroll = 0;
	let isScrolling = false;
	let viewportWidth = 0;

	/** @type {HTMLDivElement} */ let scrollLeftEl;
	/** @type {HTMLDivElement} */ let scrollRightEl;
	/** @type {ReturnType<typeof setInterval>} */ let scrollTimer;

	const W = 41.5;
	const COVER = W * 4;
	const BOOK  = W * 5;

	const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

	$: booksInViewport = viewportWidth / (W + 11);
	$: maxScroll = Math.max(0, (W + 12) * (books.length - booksInViewport) + (bookIndex > -1 ? COVER : 0) + 5);
	$: if (scroll > maxScroll) scroll = maxScroll;

	function stopScroll() {
		isScrolling = false;
		clearInterval(scrollTimer);
	}

	function selectBook(i) {
		if (i === bookIndex) {
			bookIndex = -1;
			const closedMax = Math.max(0, (W + 12) * (books.length - booksInViewport) + 5);
			if (scroll > closedMax) scroll = closedMax;
			return;
		}
		bookIndex = i;
		const openMax = Math.max(0, (W + 12) * (books.length - booksInViewport) + COVER + 5);
		scroll = clamp((i - (booksInViewport - 4.5) / 2) * (W + 11), 0, openMax);
	}

	onMount(() => {
		function attachArrow(el, dir) {
			const onStart = () => {
				isScrolling = true;
				clearInterval(scrollTimer);
				scrollTimer = setInterval(() => {
					const next = clamp(scroll + dir * 3, 0, maxScroll);
					scroll = next;
					if (next === 0 || next === maxScroll) stopScroll();
				}, 10);
			};
			el.addEventListener('mouseenter', onStart);
			el.addEventListener('mouseleave', stopScroll);
			el.addEventListener('touchstart', onStart);
			el.addEventListener('touchend', stopScroll);
			return () => {
				stopScroll();
				el.removeEventListener('mouseenter', onStart);
				el.removeEventListener('mouseleave', stopScroll);
				el.removeEventListener('touchstart', onStart);
				el.removeEventListener('touchend', stopScroll);
			};
		}
		const detachLeft  = attachArrow(scrollLeftEl,  -1);
		const detachRight = attachArrow(scrollRightEl,  1);
		return () => { detachLeft(); detachRight(); };
	});
</script>

<svelte:head>
	<title>Reading | Ahitagni D</title>
</svelte:head>

<svg class="paper-svg">
	<defs>
		<filter id="paper" x="0%" y="0%" width="100%" height="100%">
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="8" result="noise" />
			<feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="diffLight">
				<feDistantLight azimuth="45" elevation="35" />
			</feDiffuseLighting>
		</filter>
	</defs>
</svg>

<div class="page-container">
	<div class="mb-4 flex items-center justify-between">
		<a href="/" class="back-link group">
			<Icon icon="mdi:arrow-bottom-left" class="arrow-icon" />
			Back
		</a>
		<ThemeToggle />
	</div>

	<div class="text-body mb-8 font-[500] text-[length:var(--text-lead)] md:text-[length:var(--text-display)]">
		Reading
	</div>

	<div class="shelf">
		<div bind:this={scrollLeftEl} class="arrow arrow-left"
			style:display={scroll > 0 ? 'flex' : 'none'}
			role="button" tabindex="-1" aria-label="Scroll left">
			<Icon icon="mdi:chevron-left" width="12" height="12" />
		</div>

		<div class="viewport" bind:clientWidth={viewportWidth}>
			<div class="row">
				{#each books as book, i}
					{@const open = bookIndex === i}
					<button
						class="book"
						style:transform="translateX(-{scroll}px)"
						style:width="{open ? BOOK : W}px"
						style:transition={isScrolling ? 'transform 100ms linear' : 'all 500ms ease'}
						onclick={() => selectBook(i)}
						aria-label="{book.title} by {book.author}"
						aria-pressed={open}
					>
						<div class="spine"
							style:background-color={book.spineColor ?? '#555'}
							style:color={book.textColor ?? '#fff'}
							style:transform="translate3d(0,0,0) rotateY({open ? '-60deg' : '0deg'})">
							<span class="paper-overlay"></span>
							<span class="title">{book.title}</span>
						</div>
						<div class="cover"
							style:transform="translate3d(0,0,0) rotateY({open ? '30deg' : '88.8deg'})"
							style:background-color={book.spineColor ?? '#555'}>
							<span class="paper-overlay cover-paper"></span>
							<span class="binding"></span>
							<img src={book.coverImage} alt="{book.title} cover" class="cover-img" loading="lazy" />
						</div>
					</button>
				{/each}
			</div>
		</div>

		<div bind:this={scrollRightEl} class="arrow arrow-right"
			style:display={scroll < maxScroll ? 'flex' : 'none'}
			role="button" tabindex="-1" aria-label="Scroll right">
			<Icon icon="mdi:chevron-right" width="12" height="12" />
		</div>
	</div>

	<hr class="divider" />

	<div class="list-panel" class:list-collapsed={bookIndex !== -1}>
		<div class="list-inner">
			{#each sortedBooks as book, i}
				{@const idx = books.indexOf(book)}
				{#if i > 0}<hr class="divider" />{/if}
				<div class="list-entry">
					<button class="list-cover-btn" onclick={() => selectBook(idx)} aria-label="Open {book.title}">
						<img src={book.coverImage} alt={book.title} class="list-cover" />
					</button>
					<div class="list-info">
						<button class="entry-title" onclick={() => selectBook(idx)}>{book.title}</button>
						<div class="entry-author">{book.author}</div>
						<div class="entry-meta">Read: {book.date} · {book.rating}/10</div>
						{#each book.description.trim().split('\n\n') as para}
							<p class="entry-desc">{para}</p>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	{#if bookIndex > -1}
		{@const book = books[bookIndex]}
		<div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
			<button class="entry-title" onclick={() => selectBook(bookIndex)}>{book.title}</button>
			<div class="entry-meta">By: {book.author} · Read: {book.date} · {book.rating}/10</div>
			{#each book.description.trim().split('\n\n') as para}
				<p class="entry-desc">{para}</p>
			{/each}
		</div>
	{/if}

	<p class="text-muted pt-12 text-center text-[length:var(--text-label)]">
		Maintained since February, 2026. Design inspired by <a href="https://adammaj.com/reading">Adam Majumdar</a>
	</p>
</div>

<style>
	.paper-svg {
		position: absolute;
		inset: 0;
		visibility: hidden;
		pointer-events: none;
	}

	.shelf {
		position: relative;
		--W: 41.5px;
		--H: 220px;
		--COVER: 166px;
	}

	.viewport {
		overflow: hidden;
		cursor: grab;
		height: var(--H);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.book {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
		height: var(--H);
		perspective: 1000px;
		border: none;
		padding: 0;
		background: none;
		cursor: pointer;
		outline: none;
	}

	.spine {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: var(--W);
		height: var(--H);
		flex-shrink: 0;
		transform-origin: right;
		transform-style: preserve-3d;
		filter: brightness(0.8) contrast(2);
		overflow: hidden;
		transition: all 500ms ease;
	}

	.cover {
		position: relative;
		flex-shrink: 0;
		overflow: hidden;
		width: var(--COVER);
		height: var(--H);
		transform-origin: left;
		transform-style: preserve-3d;
		filter: brightness(0.8) contrast(2);
		transition: all 500ms ease;
	}

	/* position:fixed inside a transformed ancestor anchors to that ancestor, not the viewport */
	.paper-overlay {
		pointer-events: none;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		height: var(--H);
		width: var(--W);
		opacity: 0.4;
		filter: url(#paper);
	}

	.cover-paper {
		left: auto;
		right: 0;
		width: var(--COVER);
	}

	.title {
		writing-mode: vertical-rl;
		margin-top: 12px;
		font-size: 12px;
		user-select: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-height: calc(var(--H) - 24px);
		pointer-events: none;
	}

	.binding {
		pointer-events: none;
		position: absolute;
		inset: 0;
		z-index: 50;
		background: linear-gradient(
			to right,
			rgba(255,255,255,0)    2px,
			rgba(255,255,255,0.5)  3px,
			rgba(255,255,255,0.25) 4px,
			rgba(255,255,255,0.25) 6px,
			transparent            7px,
			transparent            9px,
			rgba(255,255,255,0.25) 9px,
			transparent            12px
		);
	}

	.cover-img {
		width: var(--COVER);
		height: var(--H);
		object-fit: fill;
		display: block;
	}

	.arrow {
		position: absolute;
		top: 0;
		height: var(--H);
		width: 28px;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 10;
		color: var(--color-text-muted);
		transition: color 0.15s;
	}

	.arrow:hover { color: var(--color-text-hover); }

	.arrow-left  { left: 0;  background: linear-gradient(to right, var(--color-bg) 60%, transparent); }
	.arrow-right { right: 0; background: linear-gradient(to left,  var(--color-bg) 60%, transparent); }

	/* CSS grid trick: animates height 0 → auto without JS measurement */
	.list-panel {
		display: grid;
		grid-template-rows: 1fr;
		transition: grid-template-rows 250ms ease, opacity 200ms ease;
	}

	.list-panel.list-collapsed {
		grid-template-rows: 0fr;
		opacity: 0;
		pointer-events: none;
	}

	.list-inner {
		overflow: hidden;
	}

	.divider {
		border: none;
		border-top: 1px solid var(--color-border);
		margin: 28px 0;
	}

	.list-entry {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 20px;
	}

	.list-cover-btn {
		flex-shrink: 0;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: block;
	}

	.list-cover {
		height: 100px;
		width: auto;
		border: 1px solid var(--color-border);
		display: block;
		transition: opacity 0.15s;
	}

	.list-cover-btn:hover .list-cover { opacity: 0.75; }

	.list-info {
		flex: 1;
		min-width: 0;
	}

	.entry-title {
		color: var(--color-text-hover);
		font-size: var(--text-lead);
		font-weight: 500;
		margin-bottom: 2px;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-align: left;
		transition: color 0.15s;
	}

	.entry-title:hover { color: var(--color-text); }

	@media (min-width: 768px) {
		.list-cover  { height: 130px; }
		.entry-title { font-size: var(--text-display); }
	}

	.entry-author {
		color: var(--color-text-muted);
		margin-bottom: 2px;
	}

	.entry-meta {
		color: var(--color-text-muted);
		margin-bottom: 8px;
	}

	.entry-desc {
		line-height: 1.6;
		margin: 0;
	}

	.entry-desc + .entry-desc { margin-top: 1em; }


</style>
