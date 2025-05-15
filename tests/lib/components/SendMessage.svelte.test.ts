import { render, screen } from '@testing-library/svelte';
import SendMessage from '$lib/components/SendMessage.svelte';

describe('SendMessage', () => {
  it('should disable the send button when sending is true', async () => {
    // Render the component with sending: true
    render(SendMessage, { sending: true });

    // Find the send button
    const sendButton = screen.getByRole('button');
    
    // Assert that the button is disabled
    expect(sendButton).toBeDisabled();


  });

  it('should enable the send button when sending is false', async () => {
    // Render the component with sending: false
    render(SendMessage, { sending: false });

    // Find the send button
    const sendButton = screen.getByRole('button');
    
    // Assert that the button is enabled
    expect(sendButton).not.toBeDisabled();
  });
});
