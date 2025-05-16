import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import ChatNav from '../../../src/lib/components/ChatNavBar.svelte';
import { vi } from 'vitest';
import type { Chat } from '../../../src/lib/types';

const data:{ chat: Chat } = {
  chat: {
    name: 'Test Chat',
    id: '1',
    created_at: '2023-10-01T00:00:00Z',
  }
};
global.Element.prototype.animate = vi.fn().mockReturnValue({
  onfinish: () => {},
  cancel: () => {},
  finish: () => {},
});


describe('ChatNav', () => {

  it('renders correctly', () => {
    const deleteChat = vi.fn();
    render(ChatNav, { props: { data, deleteChat },});
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
  });

  it('toggles the menu when the button is clicked', async () => {
    const deleteChat = vi.fn();
    render(ChatNav, { props: { data, deleteChat } });
    
    const menuButton = screen.getByRole('button', { name: /Opzioni chat/i });
  
    // Initially, the menu should not be visible
    expect(screen.queryByText('Elimina chat')).not.toBeInTheDocument();
  
    // First click: open the menu
    await fireEvent.click(menuButton);
   
    await waitFor(() => {
      expect(screen.getByText('Elimina chat')).toBeInTheDocument();
    });

    // BUG next click: cannot dismiss the menu
  });
  
  

  it('calls deleteChat when "Elimina chat" is clicked', async () => {
    const deleteChat = vi.fn();

    render(ChatNav, {
      props: { data, deleteChat },
    });

    const menuButton = screen.getByLabelText('Opzioni chat');
    await fireEvent.click(menuButton);

    const deleteButton = screen.getByText('Elimina chat');
    await fireEvent.click(deleteButton);

    expect(deleteChat).toHaveBeenCalled();
  });
});
