import type { RouteRecord } from 'atomic-router-react';

import { AuthLayout } from '~/layouts/auth';

import { currentRoute } from './model';
import { SignInPage } from './page';

export const SignInRoute: RouteRecord<any, any> = {
	route: currentRoute,
	view: SignInPage,
	layout: AuthLayout,
};
