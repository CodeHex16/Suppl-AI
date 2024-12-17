<script>
	import { House, User, MessageCirclePlus, MessageCircle } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	let { data } = $props();
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="my-auto">
		<div class="mx-auto mt-10 w-fit rounded-full bg-white p-4 shadow-md">
			<User class="h-40 w-40 stroke-gray-300 stroke-1" />
		</div>
	</header>
	<main>
		<div class="space-y-4 rounded-t-3xl bg-white p-4 pb-10">
			<h2 class="mb-6 mt-2 text-xl font-semibold">Profilo</h2>
			<p>Email : {data.creds.email}</p>
			<p>Password : {data.creds.password}</p>
			<!-- <button class="rounded-3xl bg-gray-100 p-4 hover:bg-gray-200" onclick={toggleMode}
				>Cambia tema</button
			> -->
		</div>
	</main>
	<footer class="flex justify-around bg-white pb-6 pt-2 shadow-md">
		<a href="/" class="">
			<div
				class="flex flex-col items-center gap-1 rounded-full p-2 px-4 text-sm opacity-50 transition duration-150 ease-in hover:bg-gray-100 hover:opacity-100"
			>
				<House />
				<p class="font-semibold">Home</p>
			</div>
		</a>
		<div>
			<button class="flex flex-col items-center gap-1">
				<div
					class="absolute bottom-5 flex flex-col items-center justify-center text-center text-sm"
				>
					<div
						class="rounded-full bg-blue-500 p-5 text-white transition duration-150 ease-in hover:bg-blue-600"
					>
						<MessageCirclePlus />
					</div>
					<p>Nuova chat</p>
				</div>
			</button>
		</div>
		<div class="flex flex-col items-center gap-1 p-2 px-4 text-sm">
			<User />
			<p class="font-semibold">Profilo</p>
		</div>
	</footer>
</div>
