import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { useUnit } from 'effector-react';

import { SignInLoginForm } from '~/features/sign-in/login-form';
import { SignInTfaForm } from '~/features/sign-in/tfa-form';

import { $viewPhase, backClicked, signInLogin, signInTfa } from './model';

export const SignInPage = () => {
	const [viewPhase] = useUnit([$viewPhase]);

	const View = {
		login: LoginView,
		tfa: TfaView,
		finish: FinishView,
	}[viewPhase];

	return <View />;
};

const LoginView = () => {
	return <SignInLoginForm model={signInLogin} />;
};

const TfaView = () => {
	const [onBackClicked] = useUnit([backClicked]);

	return (
		<>
			<Button onClick={onBackClicked} icon={<ArrowLeftOutlined />} className="!absolute l-0 t-0" />

			<SignInTfaForm model={signInTfa} />
		</>
	);
};

const FinishView = () => {
	return <Typography.Title className="text-center mt-[4px] px-[10px]">Logged</Typography.Title>;
};
