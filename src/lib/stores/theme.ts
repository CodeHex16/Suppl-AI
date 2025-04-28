import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const theme = writable('light');

if (browser) {
  console.log('[theme.ts] Browser environment detected.');

  const storedTheme = localStorage.getItem('theme');
  console.log('[theme.ts] Stored theme:', storedTheme);

  if (storedTheme) {
    theme.set(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
    console.log('[theme.ts] Set theme from localStorage:', storedTheme);
  }

  theme.subscribe((value) => {
    console.log('[theme.ts] Theme changed to:', value);
    localStorage.setItem('theme', value);
    document.documentElement.setAttribute('data-theme', value);
  });
} else {
  console.log('[theme.ts] Server-side: skipping theme logic.');
}
