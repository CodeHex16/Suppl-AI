<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	
	let { data } = $props();
</script>


<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Statistiche" />

	<main class="flex flex-col pt-2 flex-grow">
		
	</main>

	<BottomNavBar {data}/>
</div>
