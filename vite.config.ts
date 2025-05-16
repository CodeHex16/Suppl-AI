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
				'src/lib/utils/logger.ts',
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
