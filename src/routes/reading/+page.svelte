<script>
	import Icon from '@iconify/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import booksData from '$lib/data/books.yml?raw';
	import yaml from 'js-yaml';
	import { onDestroy, onMount } from 'svelte';

	/** @type {any[]} */
	const books = yaml.load(booksData);

	let bookIndex = -1;
	let scroll = 0;
	let isScrolling = false;
	let viewportWidth = 0;

	// Arrow element refs — event listeners attached once in onMount (mirrors Adam's useEffect)
	/** @type {HTMLDivElement} */
	let scrollLeftEl;
	/** @type {HTMLDivElement} */
	let scrollRightEl;

	const W = 41.5;  // spine width px
	const H = 220;   // book height px
	const COVER = W * 4; // 166px
	const BOOK  = W * 5; // 207.5px

	$: booksInViewport = viewportWidth / (W + 11);
	$: maxScroll = Math.max(
		0,
		(W + 12) * (books.length - booksInViewport) + (bookIndex > -1 ? COVER : 0) + 5
	);
	// Re-clamp when maxScroll shrinks (viewport resize). Mirrors Adam's viewportDimensions effect.
	$: if (scroll > maxScroll) scroll = maxScroll;

	const clamp = (/** @type {number} */ v, /** @type {number} */ lo, /** @type {number} */ hi) =>
		Math.max(lo, Math.min(hi, v));

	/** @param {number} inc */
	function boundedRelativeScroll(inc) {
		const next = clamp(scroll + inc, 0, maxScroll);
		scroll = next;
		// Auto-stop when a bound is hit — prevents isScrolling getting stuck if the arrow
		// element becomes display:none while the cursor is still over it (display:none does
		// not reliably fire mouseleave in all browsers).
		if (next === 0 || next === maxScroll) stopScroll();
	}

	/** @param {number} i */
	function selectBook(i) {
		if (i === bookIndex) {
			bookIndex = -1;
			// Clamp scroll atomically — mirrors Adam's boundedRelativeScroll(0).
			const closedMax = Math.max(0, (W + 12) * (books.length - booksInViewport) + 5);
			if (scroll > closedMax) scroll = closedMax;
			return;
		}
		bookIndex = i;
		const openMax = Math.max(0, (W + 12) * (books.length - booksInViewport) + COVER + 5);

		// "Scroll just enough" — only move if the full open book (spine + cover) isn't
		// already visible. This avoids pulling end-of-shelf books to the center.
		const bookLeft = i * (W + 12);
		const bookRight = bookLeft + BOOK;
		if (bookRight > scroll + viewportWidth) {
			// Cover would be clipped on the right — scroll right just enough to show it.
			scroll = clamp(bookRight - viewportWidth, 0, openMax);
		} else if (bookLeft < scroll) {
			// Spine is off-screen left — scroll left to show it.
			scroll = clamp(bookLeft, 0, openMax);
		}
		// else: full open book already fits in viewport — open in place, no scroll.
	}

	/** @type {ReturnType<typeof setInterval> | null} */
	let scrollTimer = null;

	function stopScroll() {
		isScrolling = false;
		if (scrollTimer) { clearInterval(scrollTimer); scrollTimer = null; }
	}

	onMount(() => {
		// Mirrors Adam's useEffect([boundedRelativeScroll]) that attaches scroll arrow listeners.
		// Keeping arrows always in the DOM (display:none when inactive) and attaching listeners
		// once ensures mouseleave fires reliably and isScrolling is never left stuck.

		/**
		 * @param {HTMLDivElement} el
		 * @param {number} dir
		 */
		function attachArrow(el, dir) {
			const onStart = () => {
				isScrolling = true;
				if (scrollTimer) clearInterval(scrollTimer);
				scrollTimer = setInterval(() => boundedRelativeScroll(dir * 3), 10);
			};
			const onStop = () => stopScroll();

			el.addEventListener('mouseenter', onStart);
			el.addEventListener('mouseleave', onStop);
			el.addEventListener('touchstart', onStart);
			el.addEventListener('touchend',   onStop);

			return () => {
				onStop();
				el.removeEventListener('mouseenter', onStart);
				el.removeEventListener('mouseleave', onStop);
				el.removeEventListener('touchstart', onStart);
				el.removeEventListener('touchend',   onStop);
			};
		}

		const detachLeft  = attachArrow(scrollLeftEl,  -1);
		const detachRight = attachArrow(scrollRightEl,  1);
		return () => { detachLeft(); detachRight(); };
	});

	onDestroy(stopScroll);
</script>

<svelte:head>
	<title>Reading | Ahitagni D</title>
</svelte:head>

<!-- SVG paper texture filter — referenced by url(#paper) on the overlay spans -->
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

	<div class="mb-8">
		<div class="text-body mb-0.5 font-[500] text-[length:var(--text-lead)] md:text-[length:var(--text-display)]">
			Reading
		</div>
		<div class="text-muted text-[length:var(--text-label)]">{books.length} books</div>
	</div>

	<div class="shelf">
		<!-- Left arrow — always in DOM, display:none when not needed (matches Adam's approach) -->
		<div
			bind:this={scrollLeftEl}
			class="arrow arrow-left"
			style:display={scroll > 0 ? 'flex' : 'none'}
			role="button"
			tabindex="-1"
			aria-label="Scroll left"
		>
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
						<!-- Spine -->
						<div
							class="spine"
							style:background-color={book.spineColor ?? '#555'}
							style:color={book.textColor ?? '#fff'}
							style:transform="translate3d(0,0,0) scale3d(1,1,1) rotateX(0deg) rotateY({open ? '-60deg' : '0deg'}) rotateZ(0deg) skew(0deg,0deg)"
						>
							<span class="paper-overlay"></span>
							<span class="title">{book.title}</span>
						</div>

						<!-- Cover -->
						<div
							class="cover"
							style:transform="translate3d(0,0,0) scale3d(1,1,1) rotateX(0deg) rotateY({open ? '30deg' : '88.8deg'}) rotateZ(0deg) skew(0deg,0deg)"
						>
							<span class="paper-overlay cover-paper"></span>
							<span class="binding"></span>
							<img src={book.coverImage} alt="{book.title} cover" class="cover-img" loading="lazy" />
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Right arrow — always in DOM, display:none when not needed -->
		<div
			bind:this={scrollRightEl}
			class="arrow arrow-right"
			style:display={scroll < maxScroll ? 'flex' : 'none'}
			role="button"
			tabindex="-1"
			aria-label="Scroll right"
		>
			<Icon icon="mdi:chevron-right" width="12" height="12" />
		</div>
	</div>
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
		-webkit-perspective: 1000px;
		gap: 0;
		border: none;
		padding: 0;
		background: none;
		cursor: pointer;
		outline: none;
		will-change: auto;
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
		will-change: auto;
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
		will-change: auto;
	}

	/* position:fixed inside a CSS-transformed ancestor anchors to that ancestor, not the
	   viewport — so these overlays cover their respective spine / cover panels. */
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
			rgba(255, 255, 255, 0)    2px,
			rgba(255, 255, 255, 0.5)  3px,
			rgba(255, 255, 255, 0.25) 4px,
			rgba(255, 255, 255, 0.25) 6px,
			transparent               7px,
			transparent               9px,
			rgba(255, 255, 255, 0.25) 9px,
			transparent               12px
		);
	}

	.cover-img {
		width: var(--COVER);
		height: var(--H);
		object-fit: cover;
		display: block;
		transition: all 500ms ease;
		will-change: auto;
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

	.arrow:hover {
		color: var(--color-text-hover);
	}

	.arrow-left {
		left: 0;
		background: linear-gradient(to right, var(--color-bg) 60%, transparent);
	}

	.arrow-right {
		right: 0;
		background: linear-gradient(to left, var(--color-bg) 60%, transparent);
	}
</style>
