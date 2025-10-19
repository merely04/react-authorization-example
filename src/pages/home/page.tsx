import { Layout, Typography } from 'antd';
import { Link } from 'atomic-router-react';

import { routes } from '~/shared/router';

export const HomePage = () => {
	return (
		<Layout className="!min-h-[100dvh] flex items-center justify-center">
			<Link to={routes.signIn}>
				<Typography className="underline uppercase">Sign In</Typography>
			</Link>
		</Layout>
	);
};
