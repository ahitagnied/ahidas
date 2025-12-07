<script lang="ts">
	let { item } = $props();
</script>

<div class="pb-3">
	<a
		href="/essays/{item.slug}"
		class="flex-1 min-w-0 pr-6 no-underline block group"
	>
		<div
			class="font-medium text-gray-600 group-hover:text-gray-800 transition-colors"
		>
			{item.title}
		</div>
		<div class="text-gray-400">{item.date}</div>
	</a>
</div>
