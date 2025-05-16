import { browser } from '$app/environment';
import { theme } from '$lib/stores/theme';

describe('theme store', () => {

  it('is in browser environment', () => {
    localStorage.setItem('theme', 'dark');
    vi.mock('$app/environment', () => ({
      browser: true,
    }));
    expect(browser).toBe(true);
  });
});