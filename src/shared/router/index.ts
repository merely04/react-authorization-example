import {
	createHistoryRouter,
	createRoute,
	createRouterControls,
	type UnmappedRouteObject,
} from 'atomic-router';
import { sample } from 'effector';
import { createBrowserHistory } from 'history';

import { appStarted } from '~/shared/init';

import { BASE_URL } from '../config/env';

export const routes = {
	home: createRoute(),
	signIn: createRoute(),
};

const mappedRoutes: UnmappedRouteObject<any>[] = [
	{
		route: routes.home,
		path: '/',
	},
	{
		route: routes.signIn,
		path: '/sign-in',
	},
];

export const controls = createRouterControls();

export const router = createHistoryRouter({
	routes: mappedRoutes,
	controls,
	base: BASE_URL.slice(0, -1),
});

sample({
	clock: appStarted,
	fn: () => createBrowserHistory(),
	target: router.setHistory,
});
