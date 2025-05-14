import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import Page from '../../../../src/routes/admin/gestione_piattaforma/+page.svelte';

import { goto } from '$app/navigation';
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

describe('Admin Platform Management Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the page with default elements', () => {
    render(Page, { data: {} });

    expect(screen.getByText('Impostazioni')).toBeInTheDocument();
    expect(screen.getByLabelText('Seleziona colore primario')).toBeInTheDocument();
    expect(screen.getByText('Durata salvataggio chat')).toBeInTheDocument();
    expect(screen.getByText('Salva impostazioni')).toBeInTheDocument();
  });

  test('updates primary color on input change', async () => {
    render(Page, { data: {} });

    const colorInput = screen.getByLabelText('Seleziona colore primario') as HTMLInputElement;
    await fireEvent.input(colorInput, { target: { value: '#ff0000' } });

    expect(colorInput.value).toBe('#ff0000');
  });



  test('submits the form with correct data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    render(Page, { data: {} });

    const submitButton = screen.getByTestId('form');
    await fireEvent.submit(submitButton);

    expect(mockFetch).toHaveBeenCalledWith('/api/update_colors', expect.any(Object));
  });
});