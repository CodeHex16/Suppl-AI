<script>
	import ChatHistory from '$lib/components/ChatHistory.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';

	let { data } = $props();
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="my-auto">
		<h1 class="text-center text-3xl font-bold">Suppl&bull;AI</h1>
	</header>

	<main class="">
		<ChatHistory {data} />
	</main>

	<BottomNavBar {data} />
</div>
