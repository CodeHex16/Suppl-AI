<script lang="ts">
	import { User, Mail } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import ProfileSettings from '$lib/components/ProfileSettings.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { type User as UserType } from '$lib/types';
	let { data }:{
		data: {
			theme: string;
			creds: UserType;
		}
	} = $props();
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="relative py-4">
		<div class="absolute right-4 top-4">
			<!-- Toggle in alto a destra -->
			<ThemeToggle {data} />
		</div>
		<div class="logo-wrapper flex flex-col h-full items-center justify-center pt-8">
			<div class="mx-auto mt-10 w-fit rounded-full bg-white p-4 shadow-md">
				<User class=" h-[25vw] w-[25vw] max-h-40 max-w-40 stroke-gray-300 stroke-1" />
			</div>
			<h2 class="font-semibold text-2xl mt-4">{data.creds.name}</h2>
			<div class="flex items-center">
				<Mail class="mr-2 h-5 w-5 text-gray-600" />
				<span>{data.creds._id}</span>
			</div>
		</div>
	</header>
	<main>
		<ProfileSettings {data} />
	</main>
	<BottomNavBar {data} />
</div>
