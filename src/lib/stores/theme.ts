import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { logger } from '$lib/utils/logger';

export const theme = writable('light');

if (browser) {
  const storedTheme = localStorage.getItem('theme') ?? 'light';
  
  const storedThemeConfig = JSON.parse(localStorage.getItem('themeConfig') ?? JSON.stringify({
    COLOR_PRIMARY: '#0dab44',
    COLOR_PRIMARY_HOVER: '#09772f',
    COLOR_PRIMARY_TEXT: '#ffffff',
    CHAT_HISTORY: 50
  }));
  logger.log('[theme.ts] Load theme:', storedTheme, 'Config:', storedThemeConfig);

  theme.subscribe((value) => {
    logger.log('[theme.ts] Theme changed to:', value);
    localStorage.setItem('theme', value);
    document.documentElement.style.setProperty('--color-primary', storedThemeConfig.COLOR_PRIMARY);
		document.documentElement.style.setProperty('--color-primary-hover', storedThemeConfig.COLOR_PRIMARY_HOVER);
		document.documentElement.style.setProperty('--color-primary-text', storedThemeConfig.COLOR_PRIMARY_TEXT);
    
  });

  // Leggere il tema salvato da server
  const db_settings = fetch('/api/update_settings').then((res) => res.json());
  db_settings.then((data) => {
    if (data) {
      const settings = {
        COLOR_PRIMARY: data.color_primary,
        COLOR_PRIMARY_HOVER: data.color_primary_hover,
        COLOR_PRIMARY_TEXT: data.color_primary_text,
        CHAT_HISTORY: data.message_history
      };
      localStorage.setItem('themeConfig', JSON.stringify(settings));
      logger.log('[theme.ts] Settings loaded:', JSON.stringify(settings));
      document.documentElement.style.setProperty('--color-primary', settings.COLOR_PRIMARY);
      document.documentElement.style.setProperty('--color-primary-hover', settings.COLOR_PRIMARY_HOVER);
      document.documentElement.style.setProperty('--color-primary-text', settings.COLOR_PRIMARY_TEXT);
      localStorage.setItem('chatHistory', settings.CHAT_HISTORY.toString());
    }
  }).catch((error) => {
    logger.error('[theme.ts] Error loading settings:', error);
  });
}