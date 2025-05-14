import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from '../../../../src/routes/admin/statistiche/+page.svelte';
describe('Page.svelte', () => {
  it('renders HeaderPages with the correct title', () => {
    const { getByText } = render(Page, { props: { data: {} } });
    expect(getByText('Statistiche')).toBeTruthy();
  });

  it('renders BottomNavBar component', () => {
    const { container } = render(Page, { props: { data: {} } });
    expect(container.querySelector('div')).toBeTruthy();
  });
});