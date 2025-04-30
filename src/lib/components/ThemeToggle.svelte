<script lang="ts">
    import { Sun, Moon } from 'lucide-svelte';
    import { enhance } from '$app/forms'; // Importa enhance

    let { data } = $props();

    let isDark = $derived(data.theme === 'dark');

</script>

<form method="POST" action="/?/toggleTheme" use:enhance>
	<input type="hidden" name="theme" value={isDark ? 'light' : 'dark'} />
    <button
        type="submit"
        class="h-12 w-12 flex items-center justify-center rounded-full bg-gray shadow-md dark:bg-gray p-3  transition cursor-pointer"
        aria-label="Cambia in tema scuro"
		aria-pressed={isDark}
        title="Cambia tema"
    >
        {#if isDark}
            <Moon class="text-white" />
        {:else}
            <Sun class="text-black" />
        {/if}
    </button>
</form>