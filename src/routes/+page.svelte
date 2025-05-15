<script lang="ts">
	import ChatHistory from '$lib/components/ChatHistory.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import HomeAdmin from '$lib/components/HomeAdmin.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import DeleteChatModal from '$lib/components/DeleteChatModal.svelte';
	import { Settings } from 'lucide-svelte';
	import type { Chat } from '$lib/types';

	let { data }:{
		data: {
			chats: Chat[];
			userScopes: string[];
			theme: string;
		}
	} = $props();
	let isAdmin: boolean = $derived(data.userScopes.includes('admin') === true);
	let showModalDelete: boolean = $state(false);
	let selectedChat: Chat | undefined = $state();
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl overflow-x-hidden">
	<header class="relative py-4">
		{#if isAdmin}
			<div class="absolute left-4 top-4 z-50">
				<a
					href="/admin/gestione_piattaforma"
					class="item-primary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full p-3 shadow-md transition"
				>
					<Settings class="h-6 w-6" />
				</a>
			</div>
		{/if}
		<div class="absolute right-4 top-4 z-50">
			<!-- Toggle in alto a destra -->
			<ThemeToggle {data} />
		</div>
		<div class="mx-auto my-auto mb-4 mt-4 flex h-full w-4/6 items-center justify-center">
			<img
				src="./img/logo_light.png"
				class="logo light-mode w-full"
				alt="Logo Light"
			/>
			<img
				src="./img/logo_dark.png"
				class="logo dark-mode w-full"
				alt="Logo Dark"
			/>
		</div>
	</header>

	{#if showModalDelete && selectedChat}
		<DeleteChatModal
			chatName={selectedChat.name}
			chatId={selectedChat.id}
			onCancel={() => (showModalDelete = false)}
		/>
	{/if}
	<main class="flex flex-col overflow-hidden">
		{#if isAdmin}
			<HomeAdmin />
		{/if}

		<div class="flex-grow rounded-t-3xl bg-white p-4 shadow-md">
			<h2 class="mb-3 ml-2 text-xl font-semibold">Cronologia Chat</h2>
			<div class="flex max-h-52 min-h-40 flex-col space-y-4 overflow-y-auto">
				{#await data.chats}
					<div role="status" class="m-auto">
						<svg
							aria-hidden="true"
							class="h-10 w-10 animate-spin fill-blue-500 text-gray-200 dark:text-gray-600"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span class="sr-only">Caricamento...</span>
					</div>
				{:then chatData}
					<ChatHistory
						data={chatData}
						onDelete={(chat: Chat) => {
							selectedChat = chat;
							showModalDelete = true;
						}}
					/>
				{:catch}
					<p class="m-auto">Caricamento chat fallito</p>
				{/await}
			</div>
		</div>
	</main>

	<BottomNavBar {data} />
</div>
