<script>
	import { ArrowLeft, Ellipsis } from 'lucide-svelte';
</script>

<nav class="grid-chat-nav m-4 grid">
	<a href="/">
		<div
			class="h-12 w-12 justify-self-start rounded-full bg-white p-3 transition duration-150 ease-in hover:bg-gray-50"
		>
			<ArrowLeft />
		</div>
	</a>
	<div class="h-12 w-fit justify-self-center rounded-full bg-gray-200 p-3 px-6">
		<h1 class="">Chat name</h1>
	</div>
	<button>
		<div
			class="h-12 w-12 justify-self-end rounded-full bg-white p-3 transition duration-150 ease-in hover:bg-gray-50"
		>
			<Ellipsis />
		</div>
	</button>
</nav>
