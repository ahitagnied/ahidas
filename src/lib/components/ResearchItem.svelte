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
		<div class="font-[500] text-body">
			{item.title}
		</div>
		<div class="text-muted">{item.journal}, {item.year}</div>
	</a>
</div>
