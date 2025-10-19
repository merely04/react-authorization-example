import { createRoutesView } from 'atomic-router-react';

import { HomeRoute } from './home';
import { SignInRoute } from './sign-in';

export const Pages = createRoutesView({
	routes: [HomeRoute, SignInRoute],
});
