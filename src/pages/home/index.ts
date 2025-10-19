import type { RouteRecord } from 'atomic-router-react';

import { currentRoute } from './model';
import { HomePage } from './page';

export const HomeRoute: RouteRecord<any, any> = {
	route: currentRoute,
	view: HomePage,
};
