import { render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import Home from '../../src/routes/+page.svelte';

vi.mock('$lib/components/ChatHistory.svelte', () => ({
	default: vi.fn()
}));
vi.mock('$lib/components/BottomNavBar.svelte', () => ({
	default: vi.fn()
}));
 vi.mock('$lib/components/HomeAdmin.svelte', () => ({
 	default: vi.fn()
}));
vi.mock('$lib/components/ThemeToggle.svelte', () => ({
	default: vi.fn()
}));
vi.mock('$lib/components/DeleteChatModal.svelte', () => ({
	default: vi.fn()
}));


const fakeResponse = new Response(JSON.stringify([
	{ id: '1', name: 'Chat 1' },
	{ id: '2', name: 'Chat 2' },
]), {
	headers: { 'Content-Type': 'application/json' },
	status: 200,
});

const mockData = {
	userScopes: ['admin'] as ('admin' | 'user')[],
	chats: Promise.resolve(fakeResponse),
  colors: "",
  theme: "light" as 'light' | 'dark',
  token: "token",
};

const mockProps = { data: mockData };

describe('Home Component', () => {

	it('should render the Home component', async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		render(Home, { props: mockProps });
		expect(screen.getByAltText('Logo Light')).toBeInTheDocument();
		expect(screen.getByAltText('Logo Dark')).toBeInTheDocument();
	});


	it('should display admin settings button when user is an admin', async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		render(Home, { props: mockProps });
		// Check if admin settings button is present
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/admin/gestione_piattaforma');
	});

  it('should display chat history when user is not an admin', async () => {
    const props = { ...mockProps, userScopes: ['user'] };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		render(Home, { props });
    const links = screen.getAllByRole('link');
    expect(links).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/admin/gestione_piattaforma' }),
      ])
    );
  });
});
