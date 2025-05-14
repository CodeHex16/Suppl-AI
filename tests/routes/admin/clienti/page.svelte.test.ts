import { render } from '@testing-library/svelte';

import AdminClientiPage from '../../../../src/routes/admin/clienti/+page.svelte';

vi.mock('$lib/components/BottomNavBar.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('$lib/components/User.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('$lib/components/NewUserModal.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('$lib/components/UpdateUserModal.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('$lib/components/HeaderPages.svelte', () => ({
  default: vi.fn(),
}));

vi.mock('$lib/components/DeleteUserConfirmModal.svelte', () => ({
  default: vi.fn(),
}));

describe('AdminClientiPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    const { getByText } = render(AdminClientiPage);
    expect(getByText('Nessun utente trovato.')).toBeInTheDocument();
  });
});