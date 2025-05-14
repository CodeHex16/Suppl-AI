// ThemeToggle.test.ts
import { render, screen } from '@testing-library/svelte';
import ThemeToggle from '$lib/components/ThemeToggle.svelte';
import { describe, it, expect } from 'vitest';

describe('ThemeToggle', () => {
	it('renders Sun icon when theme is light', () => {
		render(ThemeToggle, { props: { data: { theme: 'light' } } });
		expect(screen.getByTitle('Cambia tema')).toContainHTML('svg'); // icon is present
		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
		expect(screen.getByDisplayValue('dark')).toBeInTheDocument(); // input value
	});

	it('renders Moon icon when theme is dark', () => {
		render(ThemeToggle, { props: { data: { theme: 'dark' } } });
		expect(screen.getByTitle('Cambia tema')).toContainHTML('svg'); // icon is present
		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByDisplayValue('light')).toBeInTheDocument(); // input value
	});
});
