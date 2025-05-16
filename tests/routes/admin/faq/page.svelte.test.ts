import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Page from '../../../../src/routes/admin/faq/+page.svelte';



describe('Admin FAQ Page', () => {
	it('renders the page with the correct title', () => {
		const { getByText } = render(Page, { data: { title: 'Gestione FAQ', faqs: [] } });
		expect(getByText('Gestione FAQ')).toBeTruthy();
	});

	it('displays a message when there are no FAQs', () => {
		const { getByText } = render(Page, { data: { faqs: [] } });
		expect(getByText('Ancora nessuna FAQ')).toBeTruthy();
	});

	
});
