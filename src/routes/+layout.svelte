<script lang="ts">
	import '../app.css';
	export let data: {
		colors: {
			COLOR_PRIMARY: string;
			COLOR_PRIMARY_HOVER: string;
			COLOR_PRIMARY_TEXT: string;
		};
	};

	// Imposta anche lato client nel caso serva JS dinamico
	if (typeof document !== 'undefined') {
		document.documentElement.style.setProperty('--color-primary', data.colors.COLOR_PRIMARY);
		document.documentElement.style.setProperty('--color-primary-hover', data.colors.COLOR_PRIMARY_HOVER);
		document.documentElement.style.setProperty('--color-primary-text', data.colors.COLOR_PRIMARY_TEXT);
	}
</script>

<slot />
