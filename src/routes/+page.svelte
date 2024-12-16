<script>
	import { House, User, MessageCirclePlus, MessageCircle } from 'lucide-svelte';
	let { data } = $props();

	function newChat() {
		const newId = data.chatIds.length + 1;
		window.location.href = `/chat/${newId}`;
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="my-auto">
		<h1 class="text-center text-3xl font-bold">Suppl&bull;AI</h1>
	</header>

	<main class="">
		<div class="h-full rounded-t-3xl bg-white p-4">
			<h2 class="mb-6 ml-2 mt-2 text-xl font-bold">Cronologia Chat</h2>
			<div class="flex flex-col space-y-4 scroll-snap-y-container overflow-y-auto min-h-40 max-h-80">
				{#if data.chatIds.length === 0}
					<p class="text-center my-auto">Ancora nessuna chat</p>
				{/if}
				{#each data.chatIds as chat}
					<a href="/chat/{chat}" class="flex gap-3 rounded-xl bg-gray-100 p-4 hover:bg-gray-200">
						<MessageCircle />
						Chat {chat}
					</a>
				{/each}
			</div>
		</div>
	</main>

	<footer class="flex justify-around bg-white p-4">
		<div class="flex flex-col items-center gap-2">
			<House />
			<p>Home</p>
		</div>
		<div>
			<button onclick={newChat} class="flex flex-col items-center gap-2">
				<MessageCirclePlus />
				<p>Nuova chat</p>
			</button>
		</div>
		<div class="flex flex-col items-center gap-2">
			<User />
			<p>Profilo</p>
		</div>
	</footer>
</div>
