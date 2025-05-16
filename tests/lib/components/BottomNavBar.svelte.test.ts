import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import BottomNavBar from '../../../src/lib/components/BottomNavBar.svelte';

import { goto } from '$app/navigation';

// Mock the `goto` function from Svelte's app navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

describe('BottomNavBar Component', () => {

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    vi.clearAllMocks();
  });

  it('renders the home, new chat, and profile buttons', () => {
    render(BottomNavBar, {props: {data: {},},});

    // Check if the buttons for Home, New Chat, and Profile exist
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Nuova chat')).toBeInTheDocument();
    expect(screen.getByText('Profilo')).toBeInTheDocument();
  });

  it('navigates to a new chat when "Nuova chat" button is clicked', async () => {
    // Mock the API response
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ chat_id: '123' }),
    };

    global.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

    render(BottomNavBar, {props: {data: {},},});

    // Click the "Nuova chat" button
    const newChatButton = screen.getByText('Nuova chat');
    await fireEvent.click(newChatButton);

    // Ensure the "goto" function is called with the correct URL
    expect(goto).toHaveBeenCalledWith('/chat/123');
  });

  it('does not navigate to new chat if the API request fails', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Failed to create chat',
    };

    global.fetch = vi.fn().mockResolvedValueOnce(mockResponse);
    render(BottomNavBar, {props: {data: {},},});

    const newChatButton = screen.getByText('Nuova chat');
    await fireEvent.click(newChatButton);

    // Ensure the "goto" function was NOT called
    expect(goto).not.toHaveBeenCalled();
  });
});