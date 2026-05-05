<script lang="ts">
	let { item } = $props();
</script>

<div class="pb-3">
	<a href="/essays/{item.slug}" class="no-underline block group">
		<span class="font-[500] text-body">{item.title}</span>
		<span class="text-muted ml-2">{item.date}</span>
	</a>
</div>
