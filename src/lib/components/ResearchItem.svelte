<script lang="ts">
	const AUTHOR_SELF = 'Ahitagni Das';

	type ResearchEntry = {
		title: string;
		authors?: string[];
		journal: string;
		year: number;
		url?: string;
	};

	let { item }: { item: ResearchEntry } = $props();

	const hasUrl = $derived.by(() => {
		const url = item.url?.trim();
		return Boolean(url && url !== '-');
	});
</script>

<div class="pb-3 font-[500]">
	{#if hasUrl}
		<a
			href={item.url}
			target="_blank"
			rel="noopener noreferrer"
			class="no-underline block group"
		>
			<div class="item-title">{item.title}</div>
		</a>
	{:else}
		<div class="item-title">{item.title}</div>
	{/if}
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
</div>
