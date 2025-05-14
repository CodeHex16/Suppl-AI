<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	let { children, data } = $props();
	let theme = $derived(data.theme);

	if (typeof document !== 'undefined') {
		document.documentElement.style.setProperty('--color-primary', data.colors.COLOR_PRIMARY);
		document.documentElement.style.setProperty('--color-primary-hover', data.colors.COLOR_PRIMARY_HOVER);
		document.documentElement.style.setProperty('--color-primary-text', data.colors.COLOR_PRIMARY_TEXT);
	}

	$effect(() => {
		if (browser) {
			document.documentElement.classList.toggle('dark', theme === 'dark');
			try {
				localStorage.setItem('theme', theme ?? 'light');
			} catch (e) {
				console.warn('Could not save theme to localStorage', e);
			}
		}
	});
</script>

{@render children?.()}
