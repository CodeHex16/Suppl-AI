import { render } from '@testing-library/svelte';
import Layout from '../../src/routes/+layout.svelte';
const mockData = {
	colors: {
		COLOR_PRIMARY: '#ff0000',
		COLOR_PRIMARY_HOVER: '#cc0000',
		COLOR_PRIMARY_TEXT: '#ffffff'
	},
	theme: 'light' as 'light' | 'dark'
};
const mockProps = { data: mockData, children: () => 'Cilderen' };

describe('Layout Component', () => {
	it('should has theme light', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		render(Layout, { props: mockProps });
		const style = getComputedStyle(document.documentElement);
		expect(style.getPropertyValue('--color-primary').trim()).toBe('#ff0000');
		expect(style.getPropertyValue('--color-primary-hover').trim()).toBe('#cc0000');
		expect(style.getPropertyValue('--color-primary-text').trim()).toBe('#ffffff');
	});

	it('should toggle theme to dark', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		const { rerender } = render(Layout, { props: mockProps });
		expect(document.documentElement.classList.contains('dark')).toBe(false);
		// Simulate theme change by re-rendering
		mockProps.data.theme = 'dark';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		await rerender({ ...mockProps });

		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});
});
