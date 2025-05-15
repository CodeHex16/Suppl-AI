import { render } from '@testing-library/svelte';
import Layout from '../../src/routes/+layout.svelte';
const mockData = {

		settings: {
			COLOR_PRIMARY: "#000000",
			COLOR_PRIMARY_HOVER: "#000000",
			COLOR_PRIMARY_TEXT: "#000000",
			CHAT_HISTORY: 10,
		},
	
	theme: 'light' as 'light' | 'dark'
};
const mockProps = { data: mockData, children: () => 'Cilderen' };

describe('Layout Component', () => {
	it('should has theme light', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		render(Layout, { props: mockProps });
		
	});

});
