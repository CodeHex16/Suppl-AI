import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'SUPPL-AI',
				short_name: 'SupplAI',
				description: 'Gestione intelligente dei documenti e FAQ',
				theme_color: '#007bff',
				background_color: '#ffffff',
				display: 'standalone',
				start_url: '/',
				icons: [
					{
						src: 'web/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'web/icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				],
				screenshots: [
					{
						src: '/screenshots/mobile.png',
						sizes: '1290x2796',
						type: 'image/png',
						form_factor: 'narrow'
					},
					{
						src: '/screenshots/desktop.png',
						sizes: '2560x1262',
						type: 'image/png',
						form_factor: 'wide'
					}
				]
			},
			devOptions: {
				enabled: true
			}
		})
	],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/setupTests.ts',
		passWithNoTests: true,
		reporters: 'verbose',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			reportsDirectory: './coverage',
			exclude: [
				'src/setupTests.ts',
				'**/*.d.ts',
				'.svelte-kit/**',
				'**/*.config.ts',
				'**/*.config.js',
				'static/**',
				'html/**',
				'node_modules/**',
				'src/lib/index.ts',
				'src/lib/utils/logger.ts'
			]
		}
	},
	css: {
		postcss: './postcss.config.js'
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	},
	server: {
		cors: true,
		allowedHosts: ['.loca.lt']
	}
}));
