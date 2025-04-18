<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let { data } = $props();

	let cssColor = "#ffffff";

	const primaryColor = writable('#007BFF'); // default fallback
	const chatRetention = writable('30');
	const logoLightFile = writable<File | null>(null);
	const logoLightName = writable('Nessun file selezionato');
	const logoDarkFile = writable<File | null>(null);
	const logoDarkName = writable('Nessun file selezionato');
	const faviconFile = writable<File | null>(null);
	const faviconName = writable('Nessun file selezionato');

	onMount(() => {
		cssColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
		if (cssColor) {
			primaryColor.set(cssColor);
		}
	});

	function resetPrimaryColor() {
		primaryColor.set(cssColor);
		setColors();
	}

	$effect(() => {
		setColors();
	});

	function setColors(){
		if (typeof document === 'undefined') return;

		const color = $primaryColor;
		const textColor = getContrastColor(color);
		const hoverColor = darken(color, 10);

		document.documentElement.style.setProperty('--color-primary', color);
		document.documentElement.style.setProperty('--color-primary-text', textColor);
		document.documentElement.style.setProperty('--color-primary-hover', hoverColor);
	}


	async function uploadFile(file: File, name: string) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('name', name)

		const res = await fetch(`/api/upload_image`, {
			method: 'POST',
			body: formData
		});

		if (!res.ok) {
			console.error(`Errore salvataggio file "${name}"`);
		} else {
			console.log(`File salvato come "${name}"`);
		}
	}


	async function handleSubmit() {
		console.log('Colore primario:', $primaryColor);
		console.log('Durata chat:', $chatRetention);

		if ($logoLightFile) await uploadFile($logoLightFile, 'logo_light.png');
		if ($logoDarkFile) await uploadFile($logoDarkFile, 'logo_dark.png');
		if ($faviconFile) await uploadFile($faviconFile, 'favicon.png');


		const resColor = await fetch('/api/update_colors', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				COLOR_PRIMARY: $primaryColor,
				COLOR_PRIMARY_TEXT: getContrastColor($primaryColor),
				COLOR_PRIMARY_HOVER: darken($primaryColor, 10)
			})
		});

		if (resColor.ok) {
			console.log('Colori salvati');
		} else {
			console.error('Errore nel salvataggio colori');
		}
		await goto('/');
	}

	function darken(hex: string, percent: number): string {
		const num = parseInt(hex.replace('#', ''), 16);
		const amt = Math.round(2.55 * percent);
		const R = (num >> 16) - amt;
		const G = ((num >> 8) & 0x00ff) - amt;
		const B = (num & 0x0000ff) - amt;
		return (
			'#' +
			(0x1000000 +
				(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
				(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
				(B < 255 ? (B < 1 ? 0 : B) : 255))
				.toString(16)
				.slice(1)
		);
	}

	function getContrastColor(hex: string): 'black' | 'white' {
		hex = hex.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5 ? 'black' : 'white';
	}
</script>


<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="mt-4">
		<nav class="grid grid-cols-3 items-center px-4">
			<a href="/">
				<div class="h-12 w-12 justify-self-start rounded-full bg-gray shadow-md p-3 transition">
					<ArrowLeft />
				</div>
			</a>
			<h1 class="text-center text-lg font-semibold">Gestione piattaforma</h1>
			<ThemeToggle />
		</nav>
	</header>

	<main class="flex flex-col pt-2 flex-grow">
		<form on:submit|preventDefault={handleSubmit}>

			<!-- Colore primario -->
			<div class="mb-4 rounded-xl bg-white shadow-md p-4 transition">
				<label class="block mb-2 font-medium text-sm">
					Colore primario <span class="text-xs">(Salvare le impostazioni per applicare)</span>
				</label>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<input
							type="color"
							bind:value={$primaryColor}
							class="w-12 h-12 cursor-pointer"
						/>
						<span class="text-sm text-gray">{$primaryColor}</span>
					</div>
					<button
						on:click={resetPrimaryColor}
						type="button"
						class="rounded-lg py-2 px-4 item-primary"
					>
						Reset
					</button>
				</div>
			</div>


			<FileUpload
				label="Logo della WebApp"
				contextLabel="Light Mode"
				fileStore={logoLightFile}
				nameStore={logoLightName}
			/>

			<FileUpload
				label="Logo della WebApp"
				contextLabel="Dark Mode"
				fileStore={logoDarkFile}
				nameStore={logoDarkName}
			/>

			<FileUpload
				label="Favicon della WebApp"
				fileStore={faviconFile}
				nameStore={faviconName}
			/>


			<!-- Durata salvataggio chat -->
			<div class="mb-4 rounded-xl bg-white shadow-md p-4 transition">
				<label class="block mb-2 font-medium text-sm">Durata salvataggio chat</label>
				<select
					bind:value={$chatRetention}
					class="w-full rounded-lg border border-gray-300 bg-white p-2 focus:outline-none"
				>
					<option value="30">30 giorni</option>
					<option value="60">60 giorni</option>
					<option value="90">90 giorni</option>
					<option value="365">1 anno</option>
				</select>
			</div>

			<!-- Pulsante Salva -->
			<div class="rounded-t-3xl bg-white p-4 shadow-md">
				<button
					type="submit"
					class="mt-2 w-full mb-4 py-3 rounded-lg item-primary"
				>
					Salva impostazioni
				</button>
			</div>
		</form>
	</main>

	<BottomNavBar {data} />
</div>
