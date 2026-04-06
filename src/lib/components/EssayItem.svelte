<script lang="ts">
	let { item } = $props();
</script>

<div class="pb-3">
	<a
		href="/essays/{item.slug}"
		class="flex items-start gap-3 no-underline group"
	>
		<img
			src={item.image}
			alt={item.title}
			loading="lazy"
			class="flex-shrink-0 aspect-square object-cover rounded"
			style="height: calc(1em * 1.6 * 2);"
		/>
		<div class="flex-1 min-w-0">
			<div class="font-[500] text-body">
				{item.title}
			</div>
			<div class="text-muted">{item.date}</div>
		</div>
	</a>
</div>
