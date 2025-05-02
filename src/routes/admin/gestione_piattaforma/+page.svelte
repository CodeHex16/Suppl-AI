<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data } = $props();

	let cssColor = "#ffffff"; // Valore iniziale, verrà sovrascritto in onMount

	let primaryColor = $state('#007BFF'); // default fallback
	let chatRetention = $state('30');
	let logoLightFile = $state<File | null>(null);
	let logoLightName = $state('Nessun file selezionato');
	let logoDarkFile = $state<File | null>(null);
	let logoDarkName = $state('Nessun file selezionato');
	let faviconFile = $state<File | null>(null);
	let faviconName = $state('Nessun file selezionato');

	onMount(() => {
		const currentPrimary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
		if (currentPrimary) {
			cssColor = currentPrimary; // Salva il colore CSS iniziale
			primaryColor = currentPrimary; // Imposta lo stato iniziale
		}
		// Non chiamare setColors() qui, $effect lo farà automaticamente
	});

	function resetPrimaryColor() {
		primaryColor = cssColor; // Assegnazione diretta
		// Non è necessario chiamare setColors() manualmente, $effect reagirà
	}

	$effect(() => {
		// Questa funzione viene chiamata automaticamente quando primaryColor cambia
		setColors();
	});

	function setColors(){
		if (typeof document === 'undefined') return;

		const color = primaryColor; // Accesso diretto
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
		console.log('Colore primario:', primaryColor); // Accesso diretto
		console.log('Durata chat:', chatRetention); // Accesso diretto

		if (logoLightFile) await uploadFile(logoLightFile, 'logo_light.png'); // Accesso diretto
		if (logoDarkFile) await uploadFile(logoDarkFile, 'logo_dark.png'); // Accesso diretto
		if (faviconFile) await uploadFile(faviconFile, 'favicon.png'); // Accesso diretto


		const resColor = await fetch('/api/update_colors', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				COLOR_PRIMARY: primaryColor, // Accesso diretto
				COLOR_PRIMARY_TEXT: getContrastColor(primaryColor), // Accesso diretto
				COLOR_PRIMARY_HOVER: darken(primaryColor, 10) // Accesso diretto
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
	<HeaderPages {data} title="Impostazioni" />

	<main class="flex flex-col pt-2 flex-grow">
		<form onsubmit={handleSubmit}>

			<!-- Colore primario -->
			<div class="mb-4 rounded-xl bg-white shadow-md p-4 transition">
				<label class="block mb-2 font-medium text-sm">
					Colore primario <span class="text-xs">(Salvare le impostazioni per applicare)</span>
				</label>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<input
							type="color"
							bind:value={primaryColor} 
							class="w-12 h-12 cursor-pointer"
						/>
						<span class="text-sm text-gray">{primaryColor}</span>
					</div>
					<button
						onclick={resetPrimaryColor}
						type="button"
						class="rounded-lg py-2 px-4 item-primary"
					>
						Reset
					</button>
				</div>
			</div>

			<!-- Passa le variabili $state direttamente -->
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

			<FileUpload
				label="Favicon della WebApp"
				bind:file={faviconFile}
				bind:name={faviconName}
			/>


			<!-- Durata salvataggio chat -->
			<div class="mb-4 rounded-xl bg-white shadow-md p-4 transition">
				<label class="block mb-2 font-medium text-sm">Durata salvataggio chat</label>
				<select
					bind:value={chatRetention}
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
