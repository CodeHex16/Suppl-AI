<script lang="ts">
	import { ArrowLeft, Ellipsis, SendHorizontal } from 'lucide-svelte';
</script>

<div class="grid-chat grid">
	<nav class="grid-chat-nav m-4 grid">
		<div class="h-12 w-12 justify-self-start rounded-full bg-white p-3">
			<a href="/" class=" "><ArrowLeft /></a>
		</div>
		<div class="h-12 w-fit justify-self-center rounded-full bg-gray-200 p-3">
			<h1 class="">Chat name</h1>
		</div>
		<div class="h-12 w-12 justify-self-end rounded-full bg-white p-3">
			<button><Ellipsis /></button>
		</div>
	</nav>
	<main>
        
    </main>
	<div class="grid-chat-bottom-bar m-4 grid gap-2 rounded-full bg-white p-2">
		<input
			type="text"
			placeholder="Scrivi un messaggio"
			class="border-none border-transparent bg-transparent focus:border-transparent focus:ring-0"
		/>
		<div class="mr-1 grid h-10 w-10 justify-center rounded-full bg-gray-100">
			<button><SendHorizontal /></button>
		</div>
	</div>
</div>
