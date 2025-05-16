import { render, screen } from '@testing-library/svelte';
import HomeAdmin from '$lib/components/HomeAdmin.svelte';
import { describe, it, expect } from 'vitest';

describe('AdminButtons component', () => {
	it('renders all admin buttons with correct labels', () => {
		render(HomeAdmin);

		// 检查每个按钮是否存在并包含文字
		expect(screen.getByText('Clienti')).toBeInTheDocument();
		expect(screen.getByText('Documenti')).toBeInTheDocument();
		expect(screen.getByText('Statistiche')).toBeInTheDocument();
		expect(screen.getByText('FAQ')).toBeInTheDocument();

		// 检查链接是否正确
		expect(screen.getByRole('link', { name: /Clienti/i })).toHaveAttribute('href', '/admin/clienti');
		expect(screen.getByRole('link', { name: /Documenti/i })).toHaveAttribute('href', '/admin/documenti');
		expect(screen.getByRole('link', { name: /Statistiche/i })).toHaveAttribute('href', '/admin/statistiche');
		expect(screen.getByRole('link', { name: /FAQ/i })).toHaveAttribute('href', '/admin/faq');
	});
});
