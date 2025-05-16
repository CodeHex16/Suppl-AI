<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { logger } from '$lib/utils/logger';
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

{@render children?.()}
