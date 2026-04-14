<script>
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let dark = $state(false);

	onMount(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	function toggleTheme() {
		dark = !dark;
		if (dark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<button
	class="theme-toggle"
	onclick={toggleTheme}
	aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	<Icon
		icon={dark ? 'tabler:sun' : 'mdi:weather-night'}
		class="h-[1.1rem] w-[1.1rem]"
	/>
</button>
