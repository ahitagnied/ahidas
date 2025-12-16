<script>
	import Icon from '@iconify/svelte';
	import { loadBooks } from '$lib/utils/books';
	import { onDestroy } from 'svelte';

	const books = loadBooks();
	
	let selectedIndex = -1;
	let container;
	let scrollInterval;

	const WIDTH = 42;
	const HEIGHT = 190;
	const BOOK_GAP = 10;

	const OPENED_WIDTH = WIDTH * 4;
	const COVER_WIDTH = WIDTH * 2;
	const PADDING_SIZE = OPENED_WIDTH - WIDTH;

	const SCROLL_SPEED_PX = 3;
	const SCROLL_INTERVAL_MS = 16;

	const OPENED_BOOK_VIEWPORT_OFFSET = 4.5;

	$: needsPadding = bookNeedsPadding(selectedIndex);

	$: dynamicPadding = needsPadding ? PADDING_SIZE : 0;

	$: maxScroll = (() => {
		if (!container) return 0;
		const totalContentWidth = (WIDTH + BOOK_GAP) * books.length + dynamicPadding;
		const scrollableWidth = totalContentWidth - container.offsetWidth;
		return Math.max(0, scrollableWidth);
	})();

	function bookNeedsPadding(bookIndex) {
		if (bookIndex < 0) return false;
		const bookPosition = bookIndex * (WIDTH + BOOK_GAP);
		const bookRightEdge = bookPosition + OPENED_WIDTH;
		const contentWidthNoPadding = (WIDTH + BOOK_GAP) * books.length;
		return bookRightEdge > contentWidthNoPadding;
	}

	function toggleBook(index) {
		if (selectedIndex === index) {
			selectedIndex = -1;
		} else {
			selectedIndex = index;
		}
		requestAnimationFrame(() => {
			scrollBookToCenter(index);
		});
	}

	function scrollBookToCenter(index) {
		if (!container) return;

		const containerWidth = container.offsetWidth;
		const bookWidth = WIDTH + BOOK_GAP;
		const booksInViewport = containerWidth / bookWidth;
		const targetScroll = (index - (booksInViewport - OPENED_BOOK_VIEWPORT_OFFSET) / 2) * bookWidth;
		const boundedScroll = Math.max(0, Math.min(maxScroll, targetScroll));

		container.scrollTo({
			left: boundedScroll,
			behavior: 'smooth'
		});
	}

	function startScroll(direction) {
		if (scrollInterval) return;
		scrollInterval = setInterval(() => {
			if (container) {
				const currentScroll = container.scrollLeft;
				const scrollAmount = direction === 'left' ? -SCROLL_SPEED_PX : SCROLL_SPEED_PX;
				
				if (direction === 'right' && currentScroll >= maxScroll) {
					return;
				}
				if (direction === 'left' && currentScroll <= 0) {
					return;
				}
				
				container.scrollLeft += scrollAmount;
			}
		}, SCROLL_INTERVAL_MS);
	}

	function stopScroll() {
		if (scrollInterval) {
			clearInterval(scrollInterval);
			scrollInterval = null;
		}
	}

	onDestroy(() => {
		if (scrollInterval) {
			clearInterval(scrollInterval);
		}
	});
</script>

<svelte:head>
	<title>Ahitagni D | Reading</title>
</svelte:head>

<div class="page-container">
	<div class="flex justify-between items-center mb-[1.2em]">
		<h1 class="mb-0">Reading</h1>
		<a href="/" class="back-link group">
			<Icon icon="mdi:arrow-bottom-left" class="arrow-icon-left" />
			Back
		</a>
	</div>

	<div 
		class="bookshelf-wrapper"
		style="--book-width: {WIDTH}px; --book-height: {HEIGHT}px; --opened-width: {OPENED_WIDTH}px;"
	>
		<svg class="hidden-svg">
			<defs>
				<filter id="paper" x="0%" y="0%" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="8" result="noise" />
					<feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="diffLight">
						<feDistantLight azimuth="45" elevation="35" />
					</feDiffuseLighting>
				</filter>
			</defs>
		</svg>

		<div class="bookshelf-container">
			<button
				class="arrow arrow-left"
				on:mouseenter={() => startScroll('left')}
				on:mouseleave={stopScroll}
				aria-label="Scroll left"
			>
				‹
			</button>

			<div class="books-scroll" bind:this={container}>
				<div class="books-container" style="padding-right: {dynamicPadding}px;">
					{#each books as book, index (book.title)}
						<button
							class="book-wrapper"
							class:open={selectedIndex === index}
							on:click={() => toggleBook(index)}
							aria-label={book.title}
						>
							<div
								class="book-spine"
								class:open={selectedIndex === index}
								style="--spine-color: {book.spineColor}; --text-color: {book.textColor};"
							>
								<span class="paper-texture"></span>
								<span class="spine-title">{book.title}</span>
							</div>

							<div class="book-cover" class:open={selectedIndex === index}>
								<span class="paper-texture"></span>
								<span class="cover-shine"></span>
								<img src={book.coverImage} alt={book.title} width={COVER_WIDTH} height={HEIGHT} />
							</div>
						</button>
					{/each}
				</div>
			</div>

			<button
				class="arrow arrow-right"
				on:mouseenter={() => startScroll('right')}
				on:mouseleave={stopScroll}
				aria-label="Scroll right"
			>
				›
			</button>
		</div>
	</div>
</div>

<style>
	.bookshelf-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		width: 100%;
		margin: 0 auto 2em;
	}

	.hidden-svg {
		position: absolute;
		inset: 0;
		visibility: hidden;
	}

	.bookshelf-container {
		position: relative;
		display: flex;
		align-items: center;
		width: calc(var(--book-width) * 13);
		min-width: calc(var(--book-width) * 8);
		max-width: 100%;
	}

	.arrow {
		cursor: pointer;
		width: calc(var(--book-width) * 0.6);
		min-width: calc(var(--book-width) * 0.6);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: calc(var(--book-width) * 0.5);
		user-select: none;
		z-index: 10;
		opacity: 0.5;
		border: none;
		background: transparent;
		transition: opacity 0.2s;
		color: #666;
	}

	.arrow:hover {
		opacity: 0.8;
	}

	.books-scroll {
		display: flex;
		overflow-x: auto;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-x: contain;
		padding: 20px 0;
		flex: 1;
	}

	.books-scroll::-webkit-scrollbar {
		display: none;
	}

	.books-container {
		display: flex;
		gap: 10px;
	}

	.book-wrapper {
		display: flex;
		align-items: flex-start;
		flex-shrink: 0;
		width: var(--book-width);
		perspective: 1000px;
		transition: all 500ms ease;
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	.book-wrapper.open {
		width: var(--opened-width);
	}

	.book-spine,
	.book-cover {
		flex-shrink: 0;
		height: var(--book-height);
		transition: all 500ms ease;
		filter: brightness(0.8) contrast(2);
		transform-style: preserve-3d;
		position: relative;
	}

	.book-spine {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: var(--book-width);
		transform-origin: right;
		background-color: var(--spine-color);
		color: var(--text-color);
		transform: rotateY(0deg);
	}

	.book-spine.open {
		transform: rotateY(-60deg);
	}

	.book-cover {
		overflow: hidden;
		transform-origin: left;
		transform: rotateY(88.8deg);
	}

	.book-cover.open {
		transform: rotateY(30deg);
	}

	.paper-texture,
	.cover-shine {
		pointer-events: none;
		position: absolute;
		inset: 0;
	}

	.paper-texture {
		opacity: 0.3;
		filter: url(#paper);
	}

	.cover-shine {
		background: linear-gradient(
			to right,
			rgba(255, 255, 255, 0) 2px,
			rgba(255, 255, 255, 0.5) 3px,
			rgba(255, 255, 255, 0.25) 4px,
			rgba(255, 255, 255, 0.25) 6px,
			transparent 7px,
			transparent 9px,
			rgba(255, 255, 255, 0.25) 9px,
			transparent 12px
		);
	}

	.spine-title {
		margin-top: 8px;
		font-size: calc(var(--book-width) * 0.26);
		writing-mode: vertical-rl;
		user-select: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-height: calc(var(--book-height) - 16px);
	}

	.book-cover img {
		display: block;
		transition: all 500ms ease;
		height: var(--book-height);
		width: auto;
		object-fit: contain;
	}
</style>
