<script>
	import { House, User, MessageCirclePlus } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	let { data } = $props();
	import { page } from '$app/state';
	import { logger } from '$lib/utils/logger';

	async function newChat() {
		let response = await fetch('/api/new_chat', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			let data = await response.json();
			logger.info('New chat data:', data);
			if (data && data.chat_id) {
				goto('/chat/' + data.chat_id);
			}
		} else {
			logger.error('Error creating new chat:', response.statusText);
		}
	}

	let isHome = page.url.pathname === '/';
	let isProfile = page.url.pathname === '/profilo'; // Added to track profile page
</script>

<footer class="flex justify-around bg-white pt-2 shadow-md">
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
				<div class="item-primary rounded-full p-5 transition duration-150 ease-in">
					<MessageCirclePlus />
				</div>
				<p>Nuova chat</p>
			</div>
		</button>
	</div>
	<a href="/profilo" class="">
		<div
			class="flex flex-col items-center gap-1 rounded-full p-2 px-4 text-sm {!isProfile &&
				'opacity-50'} transition duration-150 ease-in hover:bg-gray-100 hover:opacity-100"
		>
			<User />
			<p class="font-semibold">Profilo</p>
		</div>
	</a>
</footer>
