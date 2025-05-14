import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi, type Mock } from 'vitest';
import Page from '../../../../src/routes/admin/documenti/+page.svelte';
import * as hh from '$lib/components/HeaderPages.svelte';

describe('Admin Documenti Page', () => {
  const mockData = {
    documents: [
       ],
    user: { name: 'Test User', email: 'test@example.com' },
    theme: 'light',
  };

  vi.mock('$lib/components/BottomNavBar.svelte', () => ({
    default: () => ({ $$render: () => '<div>Mocked BottomNavBar</div>' }),
  }));
  vi.mock('$lib/components/Document.svelte', () => ({
    default: () => ({ $$render: () => '<div>Mocked Document</div>' }),
  }));
  vi.mock('$lib/components/NewDocumentModal.svelte', () => ({
    default: () => ({ $$render: () => '<div>Mocked NewDocumentModal</div>' }),
  }));
  console.log('Mocked HeaderPages:', hh.default);
  vi.mock('$lib/components/HeaderPages.svelte', () =>  {
    return {
      default: vi.fn(),
    };
  });
  vi.mock('$lib/components/DeleteDocumentModal.svelte', () => ({
    default: () => ({ $$render: () => '<div>Mocked DeleteDocumentModal</div>' }),
  }));

  it('renders the page with documents', () => {
    render(Page, { props: { data: mockData } });
    expect(screen.getByText('Ancora nessun documento')).toBeInTheDocument();
  });

});
