import Profile from '../../../src/routes/profilo/+page.svelte';

import { render } from '@testing-library/svelte';
import { type User } from '$lib/types';

const mockUser: User = {
  _id: '123',
  email: 'hi@hi.com',
  name: 'John Doe',
  role: 'user',
};

vi.mock('$lib/components/BottomNavBar.svelte', () => ({
  default: vi.fn(),
}));
vi.mock('$lib/components/ProfileSettings.svelte', () => ({
  default: vi.fn(),
}));
vi.mock('$lib/components/ThemeToggle.svelte', () => ({
  default: vi.fn(),
}));

describe('Profile component', () => {
  it('should render the profile page correctly', () => {
    const { getByText } = render(Profile, {
      props: {
        data: {
          theme: 'light',
          creds: mockUser,
        },
      },
    });
    expect(getByText('John Doe')).toBeTruthy();
  });
});