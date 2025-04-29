<script lang="ts">
	import { onMount } from 'svelte';
	import { Sun, Moon } from 'lucide-svelte'; // Usa le icone di Lucide

	let isDark = false;

	onMount(() => {
		const theme = localStorage.getItem('theme');
		isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        console.log(isDark)
	});

	function toggleTheme() {
		isDark = !isDark;
		const newTheme = isDark ? 'dark' : 'light';
		localStorage.setItem('theme', newTheme);
		document.documentElement.classList.toggle('dark', isDark);
	}
</script>

<div
	class="h-12 w-12 justify-self-end rounded-full bg-white shadow-md dark:bg-gray-800 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
	on:click={toggleTheme}
	aria-label="Toggle Theme"
	title="Cambia tema"
>
	{#if isDark}
        <Moon class="text-white" />
	{:else}
        <Sun class="text-black" />
	{/if}
</div>
