<script lang="ts">
	import { MessageCircle, Trash } from 'lucide-svelte';
	let { data } = $props();

	function parseDate(date: string) {
		const dateObj = new Date(date);
		return dateObj.toLocaleString('it-IT', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	}
</script>

{#if data.length === 0}
	<p class="my-auto text-center">Ancora nessuna chat</p>
{/if}

<!-- TODO: fix this cycle -->
{#each data as chat}
	<div class="bg-gray rounded-xl flex items-center justify-between">
		<a
			href="/chat/{chat.id}"
			class="flex flex-grow items-center gap-3  p-4 transition duration-150 ease-in"
		>
			<!-- <MessageCircle /> -->
			<div class="grid items-center">
				{chat.name}
				<p class="text-sm opacity-60">{parseDate(chat.created_at)}</p>
			</div>
		</a>
		<form method="POST" action="/?/deleteChat" class="ml-auto">
			<input type="hidden" name="chat_id" value={chat.id} />
			<button
				type="submit"
				class="rounded-full p-4 transition duration-150 ease-in hover:text-red-500"
			>
				<Trash class="h-6 w-6" />
			</button>
		</form>
	</div>
{/each}
