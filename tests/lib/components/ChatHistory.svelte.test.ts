import { render, screen, fireEvent } from '@testing-library/svelte';
import ChatList from '../../../src/lib/components/ChatHistory.svelte'
import { vi } from 'vitest';

describe('ChatList', () => {
  it('shows message when no chats are available', () => {
    render(ChatList, {
      props: {
        data: [],
        onDelete: vi.fn(),
      },
    });

    expect(screen.getByText('Ancora nessuna chat')).toBeInTheDocument();
  });

  it('renders multiple chat items correctly', () => {
    const chats = [
      { id: '1', name: 'Chat Uno', created_at: '2024-05-01T12:00:00Z' },
      { id: '2', name: 'Chat Due', created_at: '2024-05-02T12:00:00Z' },
    ];

    render(ChatList, {
      props: {
        data: chats,
        onDelete: vi.fn(),
      },
    });

    // Check chat names
    expect(screen.getByText('Chat Uno')).toBeInTheDocument();
    expect(screen.getByText('Chat Due')).toBeInTheDocument();

    // Check dates (formatted in Italian format: DD/MM/YYYY)
    expect(screen.getByText('01/05/2024')).toBeInTheDocument();
    expect(screen.getByText('02/05/2024')).toBeInTheDocument();

    // Check delete buttons (assuming one per item)
    const deleteButtons = screen.getAllByRole('button');
    expect(deleteButtons.length).toBe(2);
  });

  it('calls onDelete with the correct chat when delete button is clicked', async () => {
    const chat = { id: '1', name: 'Chat Uno', created_at: '2024-05-01T12:00:00Z' };
    const onDeleteMock = vi.fn();

    render(ChatList, {
      props: {
        data: [chat],
        onDelete: onDeleteMock,
      },
    });

    const deleteButton = screen.getByRole('button');
    await fireEvent.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(chat);
  });
});
