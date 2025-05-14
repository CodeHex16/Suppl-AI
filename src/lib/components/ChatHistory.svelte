<script lang="ts">
	import { MessageCircle, Trash2 } from 'lucide-svelte';
	import type { Chat } from '$lib/types';
	import { parseDate } from '$lib/utils/date';

	let {
		data,
		onDelete
	}: {
		data: Array<Chat>;
		onDelete: (chat: Chat) => void;
	} = $props();
</script>

{#if data.length === 0}
	<p class="my-auto text-center">Ancora nessuna chat</p>
{/if}

<!-- TODO: fix this cycle -->
{#each data as chat}
	<div class="bg-gray flex items-center justify-between rounded-xl">
		<a
			href="/chat/{chat.id}"
			class="flex flex-grow items-center gap-3 p-4 transition duration-150 ease-in"
		>
			<!-- <MessageCircle /> -->
			<div class="grid items-center">
				{chat.name}
				<p class="text-sm opacity-60">{parseDate(chat.created_at)}</p>
			</div>
		</a>
		<button
			type="button"
			class="ml-auto rounded-full p-4 transition duration-150 ease-in hover:text-red-500"
			onclick={() => onDelete(chat)}
		>
			<Trash2 class="h-6 w-6" />
		</button>
	</div>
{/each}
