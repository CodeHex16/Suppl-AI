import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/setupTests.ts',
		passWithNoTests: true,
		reporters: 'verbose', 
		coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
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
				'src/lib/index.ts'
			],
    },
	},
	css: {
    postcss: './postcss.config.js',
  },
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
	},
	server: {
		cors: true
	},
}));
