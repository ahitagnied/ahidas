<script lang="ts">
	const AUTHOR_SELF = 'Ahitagni Das';

	type ResearchEntry = {
		title: string;
		authors?: string[];
		journal: string;
		year: number;
		image?: string;
		links?: Record<string, string>;
	};

	let { item }: { item: ResearchEntry } = $props();

	const activeLinks = $derived(
		Object.entries(item.links ?? {}).filter(([, url]) => url?.trim())
	);
</script>

<div class="flex items-center gap-4 pb-5 font-[500]">
	{#if item.image}
		<img
			src={item.image}
			alt={item.title}
			class="w-[30%] shrink-0 aspect-[180/101] object-cover"
		/>
	{/if}
	<div>
		<div class="text-body">{item.title}</div>
		{#if item.authors?.length}
			<div class="research-authors">
				{#each item.authors as author, i}
					{#if i > 0}<span>, </span>{/if}
					{#if author === AUTHOR_SELF}
						<span class="research-author-self">{author}</span>
					{:else}
						{author}
					{/if}
				{/each}
			</div>
		{/if}
		<div class="research-meta">{item.journal}, {item.year}</div>
		{#if activeLinks.length}
			<div class="mt-1 flex gap-2">
				{#each activeLinks as [label, url]}
					<a href={url} target="_blank" rel="noopener noreferrer" class="research-link">{label}</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
