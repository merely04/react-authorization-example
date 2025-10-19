import { ConfigProvider } from 'antd';
import { RouterProvider } from 'atomic-router-react';

import { Pages } from '~/pages';

import { router } from '~/shared/router';

import './globals.css';

export const App = () => {
	return (
		<RouterProvider router={router}>
			<ConfigProvider theme={{ cssVar: true }}>
				<Pages />
			</ConfigProvider>
		</RouterProvider>
	);
};
