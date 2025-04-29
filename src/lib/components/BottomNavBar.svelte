<script>
	import { House, User, MessageCirclePlus, MessageCircle } from 'lucide-svelte';
	import { invalidate } from '$app/navigation';
	import { goto } from '$app/navigation';
	let { data } = $props();
	import { page } from '$app/stores';


	async function newChat() {
		const chat_id = await fetch('http://localhost:8000/chats/new_chat', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + data.token
			}
		}).then((res) => res.json());


		await invalidate('app:chat'); // per rimuovere la cache, altrimenti la lista di chat non si aggiorna
		await goto(`/chat/${chat_id.chat_id}`);
	}

	let isHome = $page.url.pathname === '/';
</script>

<footer class="flex justify-around bg-white shadow-md pb-6 pt-2">
	<a href="/" class="">
		<div
			class="flex flex-col items-center gap-1 rounded-full p-2 px-4 text-sm {!isHome &&
				'opacity-50'} transition duration-150 ease-in hover:bg-gray-100 hover:opacity-100"
		>
			<House />
			<p class="font-semibold">Home</p>
		</div>
	</a>
	<div>
		<button onclick={newChat} class="relative bottom-4 flex flex-col items-center gap-1">
			<div class="flex flex-col items-center justify-center text-center text-sm">
				<div
					class="rounded-full item-primary p-5 transition duration-150 ease-in"
				>
					<MessageCirclePlus />
				</div>
				<p>Nuova chat</p>
			</div>
		</button>
	</div>
	<a href="/profilo" class="">
		<div
			class="flex flex-col items-center gap-1 rounded-full p-2 px-4 text-sm {isHome &&
				'opacity-50'} transition duration-150 ease-in hover:bg-gray-100 hover:opacity-100"
		>
			<User />
			<p class="font-semibold">Profilo</p>
		</div>
	</a>
</footer>
