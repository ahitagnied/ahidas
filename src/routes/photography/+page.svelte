<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import portfolioData from '$lib/data/portfolio.yml?raw';
	import yaml from 'js-yaml';

	const images = yaml.load(portfolioData);

	let isOpen = false;
	let currentIndex = 0;
	let initialOverflow = '';
	let touchStartX = null;
	let touchStartY = null;

	const open = (index) => {
		currentIndex = index;
		isOpen = true;
	};

	const close = () => {
		isOpen = false;
	};

	const next = () => {
		currentIndex = (currentIndex + 1) % images.length;
	};

	const prev = () => {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	};

	const toAlt = (item) => {
		if (item?.alt) return item.alt;
		const path = item?.src ?? '';
		return path.split('/').pop()?.replace('.avif', '').replace(/-/g, ' ') ?? 'photograph';
	};

	const handleTouchStart = (event) => {
		const [touch] = event.touches;
		if (!touch) return;
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
	};

	const handleTouchEnd = (event) => {
		if (touchStartX === null || touchStartY === null) return;
		const [touch] = event.changedTouches;
		if (!touch) return;
		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;
		const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
		if (isHorizontal && Math.abs(deltaX) > 50) {
			if (deltaX < 0) {
				next();
			} else {
				prev();
			}
		}
		touchStartX = null;
		touchStartY = null;
	};

	onMount(() => {
		if (!browser) return undefined;
		initialOverflow = document.body.style.overflow || '';

		const handleKeydown = (event) => {
			if (!isOpen) return;
			if (event.key === 'Escape') close();
			if (event.key === 'ArrowRight') next();
			if (event.key === 'ArrowLeft') prev();
		};

		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = initialOverflow;
		};
	});

	$: if (browser) {
		document.body.style.overflow = isOpen ? 'hidden' : initialOverflow;
	}
</script>

<svelte:head>
	<title>Ahitagni D | Photography</title>
</svelte:head>

<div class="page-container">
	<div class="flex justify-between items-center mb-[1.2em]">
		<h1 class="mb-0">Photography</h1>
		<a href="/" class="back-link group">
			<Icon icon="mdi:arrow-bottom-left" class="arrow-icon-left" />
			Back
		</a>
	</div>

	<div class="mx-auto w-full max-w-[600px]">
		<div class="flex flex-col gap-8">
			{#each images as image, index (image.src)}
				<button
					type="button"
					class="group block w-full text-left focus:outline-none focus-visible:outline-none"
					on:click={() => open(index)}
					aria-label={`Open ${toAlt(image)}`}
				>
					<img
						src={image.src}
						alt={toAlt(image)}
						class="w-full h-auto block"
						loading="lazy"
					/>
				</button>
			{/each}
		</div>
	</div>
</div>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-white p-4"
		on:click={close}
		role="dialog"
		aria-modal="true"
	>
		<button
			type="button"
			class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:text-gray-900"
			aria-label="Close"
			on:click|stopPropagation={close}
		>
			<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M6 6l12 12" stroke-linecap="round" />
				<path d="M18 6l-12 12" stroke-linecap="round" />
			</svg>
		</button>

		<button
			type="button"
			class="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:text-gray-900 sm:flex"
			aria-label="Previous image"
			on:click|stopPropagation={prev}
		>
			<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		<div
			class="max-h-[90vh] w-full max-w-[90vw] sm:max-w-[80vw] cursor-pointer outline-none focus:outline-none focus-visible:outline-none"
			role="button"
			tabindex="-1"
			on:click={(e) => {
				e.stopPropagation();
				const rect = e.currentTarget.getBoundingClientRect();
				const mid = rect.left + rect.width / 2;
				if (e.clientX < mid) prev();
				else next();
			}}
			on:touchstart={handleTouchStart}
			on:touchend={handleTouchEnd}
		>
			<img
				src={images[currentIndex].src}
				alt={toAlt(images[currentIndex])}
				class="max-h-[90vh] w-full select-none object-contain outline-none"
				draggable="false"
			/>
		</div>

		<button
			type="button"
			class="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:text-gray-900 sm:flex"
			aria-label="Next image"
			on:click|stopPropagation={next}
		>
			<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</div>
{/if}
