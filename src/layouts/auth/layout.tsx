import { Layout } from 'antd';
import type { PropsWithChildren } from 'react';

import { DebugMenu } from '~/widgets/debug-menu';

import { USE_MOCK_API } from '~/shared/config';

export const AuthLayout = (props: PropsWithChildren) => {
	return (
		<Layout className="!min-h-[100dvh] flex items-center justify-center">
			<div className="flex flex-col max-w-[440px] w-full p-[32px] rounded-[6px] bg-[var(--ant-color-bg-container)]">
				{/* Logo  */}
				<div
					className="bg-no-repeat bg-center h-[64px]"
					style={{
						backgroundImage: 'url(/logo.svg)',
					}}
				/>

				{props.children}
			</div>

			{USE_MOCK_API && <DebugMenu />}
		</Layout>
	);
};
