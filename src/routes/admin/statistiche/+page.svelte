<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
</script>


<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="mt-4">
		<nav class="grid grid-cols-3 items-center px-4">
			<a href="/">
				<div class="h-12 w-12 justify-self-start rounded-full bg-gray shadow-md p-3 transition">
					<ArrowLeft />
				</div>
			</a>
			<h1 class="text-center text-lg font-semibold">Statistiche</h1>
			<ThemeToggle />
		</nav>
	</header>

	<main class="flex flex-col pt-2 flex-grow">
		
	</main>

	<BottomNavBar />
</div>
