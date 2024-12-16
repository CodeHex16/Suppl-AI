<script>
	import { ArrowLeft, Ellipsis } from 'lucide-svelte';
</script>
<nav class="grid-chat-nav m-4 grid">
		<div class="h-12 w-12 justify-self-start rounded-full bg-white p-3 hover:bg-gray-50">
			<a href="/" class=" "><ArrowLeft /></a>
		</div>
		<div class="h-12 w-fit justify-self-center rounded-full bg-gray-200 p-3">
			<h1 class="">Chat name</h1>
		</div>
		<div class="h-12 w-12 justify-self-end rounded-full bg-white hover:bg-gray-50 p-3">
			<button><Ellipsis /></button>
		</div>
	</nav>