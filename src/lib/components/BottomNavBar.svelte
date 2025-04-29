<script>
	import { House, User, MessageCirclePlus, MessageCircle } from 'lucide-svelte';
	import { invalidate } from '$app/navigation';
	import { goto } from '$app/navigation';
	let { data } = $props();
	import { page } from '$app/stores';
	import { PUBLIC_DATABASE_URL } from '$env/static/public';

	async function newChat() {
		const chat_id = await fetch('http://' + PUBLIC_DATABASE_URL + '/chats', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + data.token
			}
		}).then((res) => res.json());

		await invalidate('app:chat'); // per rimuovere la cache, altrimenti la lista di chat non si aggiorna
		await goto(`/chat/${chat_id.chat_id}`);
	}

	let isHome = $page.url.pathname === '/';
</script>

<footer class="flex justify-around bg-white pb-6 pt-2 shadow-md">
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
		<button onclick={newChat} class="flex flex-col items-center gap-1">
			<div class="absolute bottom-5 flex flex-col items-center justify-center text-center text-sm">
				<div class="item-primary rounded-full p-5 transition duration-150 ease-in">
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
