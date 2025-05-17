import { render, screen } from '@testing-library/svelte';
import PWAInstallPrompt from '$lib/components/PWAInstallPrompt.svelte';

describe('PWAInstallPrompt', () => {

  it('should render the install prompt when showButton is true', () => {
    render(PWAInstallPrompt,{ data:{showButton: true }});

    expect(screen.getByText('Install')).toBeInTheDocument();
  });

});