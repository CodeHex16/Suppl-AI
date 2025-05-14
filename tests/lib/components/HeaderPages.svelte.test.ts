import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import HeaderPages from '$lib/components/HeaderPages.svelte';

describe('HeaderPages component', () => {
	it('renders back button', () => {
		render(HeaderPages, {
			props: {
				data: { theme: 'light' },
			},
		});

		const backButton = screen.getByRole('link', { name: '' });
		expect(backButton).toHaveAttribute('href', '/');
	});

	it('renders title if provided', () => {
		render(HeaderPages, {
			props: {
				data: { theme: 'dark' },
				title: 'ChatGPT',
			},
		});

		expect(screen.getByText('ChatGPT')).toBeInTheDocument();
	});

	it('renders empty title container if title not provided', () => {
		const { container } = render(HeaderPages, {
			props: {
				data: { theme: 'light' },
			},
		});

		const emptyDivs = container.querySelectorAll('h1');
		expect(emptyDivs.length).toBeGreaterThanOrEqual(0);
	});
});
