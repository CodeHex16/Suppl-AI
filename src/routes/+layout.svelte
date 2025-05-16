<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { logger } from '$lib/utils/logger';

	import PwaInstallPrompt from '$lib/components/PWAInstallPrompt.svelte';
  import { pwaInfo } from 'virtual:pwa-info';
  let webManifestLink = pwaInfo?.webManifest?.linkTag ?? '';

	let {
		children,
		data
	}: {
		children: () => any;
		data: {
			theme: string;
			settings: {
				COLOR_PRIMARY: string;
				COLOR_PRIMARY_HOVER: string;
				COLOR_PRIMARY_TEXT: string;
			};
		};
	} = $props();
	let theme = $derived(data.theme);

	if (typeof document !== 'undefined') {
		document.documentElement.style.setProperty('--color-primary', data.settings.COLOR_PRIMARY);
		document.documentElement.style.setProperty(
			'--color-primary-hover',
			data.settings.COLOR_PRIMARY_HOVER
		);
		document.documentElement.style.setProperty(
			'--color-primary-text',
			data.settings.COLOR_PRIMARY_TEXT
		);
	}

	$effect(() => {
		if (browser) {
			document.documentElement.classList.toggle('dark', theme === 'dark');
			try {
				localStorage.setItem('theme', theme ?? 'light');
			} catch (e) {
				logger.warn('Could not save theme to localStorage', e);
			}
		}
	});

	
</script>

<svelte:head>
	<title>Suppl-AI</title>
  {@html webManifestLink}
	<link rel="apple-touch-icon" href="img/favicon.ico">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="default">
	<meta name="apple-mobile-web-app-title" content="SUPPL-AI">

</svelte:head>
<PwaInstallPrompt />
{@render children?.()}
