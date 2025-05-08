<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data } = $props();

	let cssColor = '#ffffff'; 

	let primaryColor = $state('#007BFF'); 
	let chatRetention = $state('50');
	let logoLightFile = $state<File | null>(null);
	let logoLightName = $state('Nessun file selezionato');
	let logoDarkFile = $state<File | null>(null);
	let logoDarkName = $state('Nessun file selezionato');
	let faviconFile = $state<File | null>(null);
	let faviconName = $state('Nessun file selezionato');

	onMount(() => {
		const currentPrimary = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-primary')
			.trim();
		if (currentPrimary) {
			cssColor = currentPrimary; 
			primaryColor = currentPrimary; 
		}
	});

	function resetPrimaryColor() {
		primaryColor = cssColor; 
	}

	$effect(() => {
		setColors();
	});

	function setColors() {
		if (typeof document === 'undefined') return;

		const color = primaryColor; 
		const textColor = getContrastColor(color);
		const hoverColor = darken(color, 10);

		document.documentElement.style.setProperty('--color-primary', color);
		document.documentElement.style.setProperty('--color-primary-text', textColor);
		document.documentElement.style.setProperty('--color-primary-hover', hoverColor);
	}

	async function uploadFile(file: File, name: string) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('name', name);

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
		console.log('Colore primario:', primaryColor); 
		console.log('Durata chat:', chatRetention);

		if (logoLightFile) await uploadFile(logoLightFile, 'logo_light.png'); 
		if (logoDarkFile) await uploadFile(logoDarkFile, 'logo_dark.png'); 
		if (faviconFile) await uploadFile(faviconFile, 'favicon.ico'); 

		const resColor = await fetch('/api/update_colors', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				COLOR_PRIMARY: primaryColor, 
				COLOR_PRIMARY_TEXT: getContrastColor(primaryColor), 
				COLOR_PRIMARY_HOVER: darken(primaryColor, 10) 
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
			(
				0x1000000 +
				(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
				(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
				(B < 255 ? (B < 1 ? 0 : B) : 255)
			)
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
	<HeaderPages {data} title="Impostazioni" />

	<main class="flex flex-grow flex-col">
		<form onsubmit={handleSubmit}>
			<div class="max-h-[calc(100vh-17em)] overflow-y-auto px-4">
				<!-- Colore primario -->
				<div class="mb-4 rounded-xl bg-white p-4 shadow-md transition">
					<label for="color" class="mb-4 block font-semibold"> Colore primario </label>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							<div class="relative h-12 w-12">
								<div
									class="absolute inset-0 rounded-full border border-gray-300 dark:border-gray-600 bg-[var(--color-primary)]"
								></div>
								<input
									id="color"
									type="color"
									bind:value={primaryColor}
									class="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0"
									aria-label="Seleziona colore primario"
								/>
							</div>
							<span class="text-sm">{primaryColor}</span>
						</div>
						<button
							onclick={resetPrimaryColor}
							type="button"
							class="item-primary rounded-full px-4 py-2"
						>
							Reset
						</button>
					</div>
				</div>

				<FileUpload
					label="Logo della WebApp"
					contextLabel="Light Mode"
					bind:file={logoLightFile}
					bind:name={logoLightName}
				/>

				<FileUpload
					label="Logo della WebApp"
					contextLabel="Dark Mode"
					bind:file={logoDarkFile}
					bind:name={logoDarkName}
				/>

				<FileUpload label="Favicon della WebApp" bind:file={faviconFile} bind:name={faviconName} />

				<!-- Durata salvataggio chat -->
				<div class="mb-4 rounded-xl bg-white p-4 shadow-md transition">
					<label for="chatRetention" class="mb-4 block font-semibold">Numero massimo di messaggi nello storico delle chat</label
					>
					<select
						bind:value={chatRetention}
						id="chatRetention"
						class="w-full rounded-full border border-gray-300 bg-white px-4 py-4 placeholder:opacity-50 dark:border-gray-500"
					>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="200">200</option>
					</select>
				</div>
			</div>

			<!-- Pulsante Salva -->
			<div class="rounded-t-3xl bg-white p-4 shadow-md">
				<button type="submit" class="item-primary mb-4 w-full rounded-full py-3">
					Salva impostazioni
				</button>
			</div>
		</form>
	</main>

	<BottomNavBar {data} />
</div>
