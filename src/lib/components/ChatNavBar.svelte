<script>
	import { ArrowLeft, EllipsisVertical, Trash2 } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let { data, deleteChat } = $props();

	let isMenuOpen = $state(false);
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleDelete() {
		deleteChat();
		isMenuOpen = false;
	}
</script>

<nav class="grid-chat-nav mx-4 mb-4 grid">
	<a href="/">
		<div class="h-12 w-12 justify-self-start rounded-full bg-white p-3 shadow-md transition">
			<ArrowLeft />
		</div>
	</a>
	<div class="flex w-full min-w-0 items-center justify-center">
		<div class="h-12 max-w-[90%] rounded-full bg-white p-3 px-6 shadow-md">
			<h1 class="truncate">{data.chat.name}</h1>
		</div>
	</div>
	<div class="relative flex w-full min-w-0 items-center justify-end">
		<button
			type="button"
			class="h-12 w-12 rounded-full bg-white p-3 shadow-md transition"
			onclick={toggleMenu}
			aria-haspopup="true"
			aria-expanded={isMenuOpen}
			aria-label="Opzioni chat"
		>
			<EllipsisVertical />
		</button>

		{#if isMenuOpen}
			<div
				class="absolute right-0 top-full z-10 mt-2 w-auto origin-top-right"
				role="menu"
				aria-orientation="vertical"
				transition:fly={{ duration: 200 }}
			>
				<button
					type="button"
					class="
                        flex items-center
                        justify-center rounded-full
                        bg-red-500 px-4 py-3
						text-white
                        shadow-md
                        transition-all duration-300 ease-in-out
						hover:bg-red-600
                    "
					role="menuitem"
					onclick={handleDelete}
					aria-label="Elimina chat"
				>
					<span class="mr-2 whitespace-nowrap"> Elimina chat </span>
					<Trash2 class="h-6 w-6" />
				</button>
			</div>
		{/if}
	</div>
</nav>
