<script lang="ts">
	let { item } = $props();
</script>

<div class="pb-3">
	<a
		href={item.url}
		target="_blank"
		rel="noopener noreferrer"
		class="no-underline block group"
	>
		<div class="font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
			{item.title}
		</div>
		<div class="text-gray-400">{item.journal}, {item.year}</div>
	</a>
</div>
