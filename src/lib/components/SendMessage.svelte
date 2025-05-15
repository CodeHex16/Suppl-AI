<script lang="ts">
	import { SendHorizontal } from 'lucide-svelte';
	let {
		sending
	}: {
		sending: boolean;
	} = $props();
</script>

<div class="grid-chat-bottom-bar mx-4 grid gap-2 rounded-full bg-white p-2 shadow-md">
	<!-- svelte-ignore a11y_autofocus -->
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
		class="hover:bg-gray mr-1 grid h-10 w-10 justify-center rounded-full transition duration-150 ease-in"
	>
		<button type="submit" disabled={sending} class={sending ? 'opacity-30' : 'opacity-100'}
			><SendHorizontal /></button>
	</div>
</div>
