<script lang="ts">
	import Icon from '@iconify/svelte';
	let { item } = $props();
</script>

<div class="flex justify-between items-start pb-3">
	<div class="flex-1 min-w-0 pr-6">
		<div class="font-medium text-gray-600">{item.title}</div>
		<div class="text-gray-400">{item.journal}, {item.year}</div>
	</div>

	<div class="flex gap-2 items-center flex-shrink-0 w-[60px] justify-end">
		<a
			href={item.url}
			target="_blank"
			rel="noopener noreferrer"
			class="px-2.5 py-1.5 bg-white border border-gray-300 rounded text-[10px] text-gray-700 hover:bg-gray-50 no-underline whitespace-nowrap"
		>
			Read here
		</a>
	</div>
</div>
