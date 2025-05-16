import { render, screen, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import ProfileSettings from '$lib/components/ProfileSettings.svelte';
import { goto } from '$app/navigation'; // SvelteKit's navigation module

// Mock the goto function
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

describe('ProfileSettings', () => {
  it('should call goto with the correct URL when the button is clicked', async () => {
    render(ProfileSettings);

    // Find the "Cambia password" button and submit the form
    const passwordButton = screen.getByText('Cambia password');
    const passwordForm = passwordButton.closest('form');
    
    await fireEvent.submit(passwordForm!); // Simulate form submit

    // expect contains the /change-password URL
    expect(goto).toHaveBeenCalledWith(expect.stringContaining('/cambio-password'));

    // Find the "Esci dall\'account" button and submit the form
    const logoutButton = screen.getByText('Esci dall\'account');
    const logoutForm = logoutButton.closest('form');
    
    await fireEvent.submit(logoutForm!); // Simulate form submit

    // Check that the goto function was called with the correct URL
    expect(goto).toHaveBeenCalledWith(window.location.origin+'/logout');
  });
});
