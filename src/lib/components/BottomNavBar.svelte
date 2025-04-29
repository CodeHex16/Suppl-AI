<script>
	import { House, User, MessageCirclePlus, MessageCircle } from 'lucide-svelte';
	import { invalidate } from '$app/navigation';
	import { goto } from '$app/navigation';
	let { data } = $props();
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';

	const DATABASE_URL = env.PUBLIC_DATABASE_URL;

	async function newChat(){
		let ris = await fetch('/api/new_chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({}),
		})
		if (ris.ok) {
			let data = await ris.json();
			if (data && data.chat_id) {
				goto('/chat/' + data.chat_id);
			}
		} else {
			console.error('Error creating new chat:', ris.statusText);
		}
	}

	let isHome = $page.url.pathname === '/';
</script>

<footer class="flex justify-around bg-white shadow-md pb-4 pt-2">
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
