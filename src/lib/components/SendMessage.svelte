<script>
	import { SendHorizontal } from 'lucide-svelte';
	import { page } from '$app/stores';
</script>

<div class="grid-chat-bottom-bar m-4 grid gap-2 rounded-full bg-white p-2">
	<input
		type="text"
		name="message"
		autofocus={true}
		autocomplete="off"
		tabindex={0}
		placeholder="Scrivi un messaggio"
		class="border-none border-transparent bg-transparent focus:border-transparent focus:ring-0"
	/>
	<div
		class="mr-1 grid h-10 w-10 justify-center rounded-full transition duration-150 ease-in hover:bg-gray-100"
	>
		<button type="submit"><SendHorizontal /></button>
	</div>
</div>
