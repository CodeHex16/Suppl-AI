<script>
	import { House, User, MessageCirclePlus, MessageCircle } from 'lucide-svelte';

	let { data } = $props();

	function newChat() {
		const newId = data.chatIds.length + 1;
		window.location.href = `/chat/${newId}`;
	}
</script>

<footer class="flex justify-around bg-white pb-6 pt-2 shadow-md">
	<div class="flex flex-col items-center gap-1 p-2 px-4 text-sm">
		<House />
		<p class="font-semibold">Home</p>
	</div>
	<div>
		<button onclick={newChat} class="flex flex-col items-center gap-1">
			<div class="absolute bottom-5 flex flex-col items-center justify-center text-center text-sm">
				<div
					class="rounded-full bg-blue-500 p-5 text-white transition duration-150 ease-in hover:bg-blue-600"
				>
					<MessageCirclePlus />
				</div>
				<p>Nuova chat</p>
			</div>
		</button>
	</div>
	<a href="/profile" class="">
		<div
			class="flex flex-col items-center gap-1 rounded-full p-2 px-4 text-sm opacity-50 transition duration-150 ease-in hover:bg-gray-100 hover:opacity-100"
		>
			<User />
			<p class="font-semibold">Profilo</p>
		</div>
	</a>
</footer>
