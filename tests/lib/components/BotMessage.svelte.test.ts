import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { vi } from 'vitest';
import ChatMessage from '../../../src/lib/components/BotMessage.svelte';
import type { Mock } from 'vitest';

describe('ChatMessage', () => {
  const mockData = {
    _id: '123',
    content: 'This is a test message',
    timestamp: '2025-05-12T08:00:00Z',
    rating: null,
  };


  let mockFetch: Mock;

  beforeEach(() => {
    // Mock fetch API
    mockFetch = vi.fn().mockResolvedValueOnce({ json: () => ({}) });
    global.fetch = mockFetch;
  });

  it('should render message content', async () => {
    render(ChatMessage, {
      props: { data: mockData },
    });
  
    // Check if message content is rendered
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('should not render message content when empty', async () => {
    render(ChatMessage, {
      props: { data: { ...mockData, content: '' } },
    });

    // Check if message content is not rendered
    expect(screen.queryByText('This is a test message')).not.toBeInTheDocument();
  });


  it('should render "Adesso" when no timestamp is provided', async () => {
    render(ChatMessage, {
      props: { data: { ...mockData, timestamp: '' } },
    });

    // Check for "Adesso" text when timestamp is missing
    expect(screen.getByText('Adesso')).toBeInTheDocument();
  });

  it('should render datatime when timestamp is provided', async () => {
    render(ChatMessage, {
      props: { data: mockData },
    });
    // Check for formatted date when timestamp is provided
    const formattedDate = new Date(mockData.timestamp).toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Rome',
    });
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  }
  );


  it('should toggle thumbs up', async () => {
    render(ChatMessage, {
      props: { data: mockData },
    });

    const likeButton = screen.getByLabelText('Like');
    await fireEvent.click(likeButton);

    // Check if the like button has been toggled to active state
    expect(likeButton).toHaveClass('item-primary');

    // Check if fetch was called
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(
      '/api/rate_message',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"rating":true')
      })
    ));
  });

  it('should toggle thumbs down', async () => {
    render(ChatMessage, {
      props: { data: mockData },
    });

    const dislikeButton = screen.getByLabelText('Dislike');
    await fireEvent.click(dislikeButton);

    // Check if the dislike button has been toggled to active state
    expect(dislikeButton).toHaveClass('item-primary');

    // Check if fetch was called with the correct parameters
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(
      '/api/rate_message',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"rating":false')
      })
    ));
  });

  it('should render markdown content correctly', async () => {
    const markdownData = {
      ...mockData,
      content: '## This is a header\n\n- Item 1\n- Item 2\n',
    };

    render(ChatMessage, {
      props: { data: markdownData },
    });

    // Check if markdown is rendered correctly
    expect(screen.getByText('This is a header')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should format date correctly', async () => {
    render(ChatMessage, {
      props: { data: mockData },
    });

    const formattedDate = new Date(mockData.timestamp).toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Rome',
    });

    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
});
