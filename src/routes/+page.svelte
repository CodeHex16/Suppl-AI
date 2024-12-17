<script>
	import { MessageCircle } from 'lucide-svelte';
	let { data } = $props();

	import BottomNavBar from './BottomNavBar.svelte';
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="my-auto">
		<h1 class="text-center text-3xl font-bold">Suppl&bull;AI</h1>
	</header>

	<main class="">
		<div class="h-full rounded-t-3xl bg-white p-4 shadow-md">
			<h2 class="mb-6 ml-2 mt-2 text-xl font-semibold">Cronologia Chat</h2>
			<div
				class="scroll-snap-y-container flex max-h-80 min-h-40 flex-col space-y-4 overflow-y-auto"
			>
				{#if data.chatIds.length === 0}
					<p class="my-auto text-center">Ancora nessuna chat</p>
				{/if}
				{#each data.chatIds as chat}
					<a
						href="/chat/{chat}"
						class="flex gap-3 rounded-xl bg-gray-100 p-4 transition duration-150 ease-in hover:bg-gray-200"
					>
						<MessageCircle />
						Chat {chat}
					</a>
				{/each}
			</div>
		</div>
	</main>

	<BottomNavBar {data} />
</div>
