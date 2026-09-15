<script lang="ts">
	import { papers, orderedLinks, linkText, isUrl, isVideo } from '$lib/research';

	const thumb = 'imbg size-32 shrink-0 rounded-l-[4px] object-cover opacity-90';
</script>

<div
	class="research-grid site grid gap-y-row pt-row text-[11px] leading-[1.2] wide:grid-cols-2"
>
	{#each papers as paper, i (i)}
		<article class="flex">
			{#if isVideo(paper.image)}
				<video class={thumb} src={paper.image} autoplay muted loop playsinline></video>
			{:else}
				<img class={thumb} src={paper.image} alt="" />
			{/if}

			<div class="min-w-0 flex-1 px-[10px]">
				<div class="pb-[5px] text-[14px] font-medium">{paper.title}</div>
				{#if paper.venue}
					<div class="pb-[5px] text-[grey]">{paper.venue}</div>
				{/if}
				<div class="hyphens-auto italic">{paper.description}</div>

				<div class="mt-[8px] grid grid-cols-[max-content_1fr] items-baseline gap-x-[6px]">
					{#each orderedLinks(paper.links) as [label, url] (label)}
						<span class="row-label">{label}</span>
						{#if isUrl(url)}
							<a class="truncate" href={url}>{linkText(url)}</a>
						{:else}
							<span class="truncate text-[grey]">{url}</span>
						{/if}
					{/each}
				</div>
			</div>
		</article>
	{/each}
</div>
