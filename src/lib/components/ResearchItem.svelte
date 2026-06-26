<script lang="ts">
	const AUTHOR_SELF = 'Ahitagni Das';

	type ResearchEntry = {
		title: string;
		authors?: string[];
		journal: string;
		year: number;
		image?: string;
		description?: string;
		links?: Record<string, string>;
	};

	let { item }: { item: ResearchEntry } = $props();

	const links = $derived(Object.entries(item.links ?? {}));
</script>

<div class="flex items-center gap-4 pb-8">
	{#if item.image}
		<img src={item.image} alt="" class="w-[150px] h-[150px] shrink-0 object-cover" draggable="false" />
	{/if}
	<div class="flex flex-col gap-[0.3em]">
		<div class="item-title">{item.title}</div>

		{#if links.length}
			<div class="flex flex-wrap gap-[5px]">
				{#each links as [label, url]}
					{#if url?.trim()}
						<a href={url} target="_blank" rel="noopener noreferrer" class="research-tag">{label}</a>
					{:else}
						<span class="research-tag research-tag--inactive">{label}</span>
					{/if}
				{/each}
			</div>
		{/if}

		<div class="research-authors">
			{#each item.authors ?? [] as author, i}
				{#if i > 0}<span>, </span>{/if}
				{#if author === AUTHOR_SELF}
					<span class="research-author-self">{author}</span>
				{:else}
					{author}
				{/if}
			{/each}
			<span class="text-muted"> · {item.journal}, {item.year}</span>
		</div>

		{#if item.description}
			<div class="research-description">{item.description}</div>
		{/if}
	</div>
</div>
