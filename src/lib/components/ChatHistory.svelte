<script lang="ts">
	import { MessageCircle } from 'lucide-svelte';
	let { data } = $props();


</script>

{#if data.length === 0}
	<p class="my-auto text-center">Ancora nessuna chat</p>
{/if}

<!-- TODO: fix this cycle -->
{#each data as chat}
	<a
		href="/chat/{chat.id}"
		class="flex gap-3 rounded-xl bg-gray-100 p-4 transition duration-150 ease-in hover:bg-gray-200"
	>
		<MessageCircle />
		{chat.name}
	</a>
{/each}
