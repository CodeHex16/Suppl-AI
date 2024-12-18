<script>
	import { User } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import ProfileSettings from '$lib/components/ProfileSettings.svelte';
	let { data } = $props();
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="my-auto">
		<div class="mx-auto mt-10 w-fit rounded-full bg-white p-4 shadow-md">
			<User class="h-40 w-40 stroke-gray-300 stroke-1" />
		</div>
	</header>
	<main>
		<ProfileSettings {data} />
	</main>
	<BottomNavBar {data} />
</div>
