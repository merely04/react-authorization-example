import { useForm } from '@effector-reform/react';
import { Button, Form, Input, Typography } from 'antd';
import { useUnit } from 'effector-react';

import { TFA_CODE_LENGTH } from './constants';
import type { signInTfaFactory } from './model';

interface SignInTfaFormProps {
	model: signInTfaFactory;
}

export const SignInTfaForm = (props: SignInTfaFormProps) => {
	const { model } = props;

	const { fields, isValid } = useForm(model.form);

	const [formDisabled, onSubmit, onContinueClicked] = useUnit([
		model.$formDisabled,
		model.form.submit,
		model.continueClicked,
	]);

	return (
		<>
			<Typography.Title level={3} className="mt-[4px] px-[10px] text-center">
				Two-Factor Authentication
			</Typography.Title>

			<Typography.Text className="text-center mt-[4px] px-[10px]">
				Enter the 6-digit code from the Google Authenticator app
			</Typography.Text>

			<Form
				disabled={formDisabled}
				initialValues={{ remember: true }}
				onFinish={onSubmit}
				layout="vertical"
				size="large"
				className="flex flex-col gap-[16px] !mt-[24px]"
			>
				<Form.Item
					name="code"
					validateStatus={fields.code.error ? 'error' : ''}
					help={fields.code.error}
					required={true}
					className="custom-input-large-height !mb-0 flex justify-center"
				>
					<Input.OTP
						value={fields.code.value}
						onChange={fields.code.onChange}
						onBlur={fields.code.onBlur}
						length={TFA_CODE_LENGTH}
					/>
				</Form.Item>

				{fields.code.value.length === TFA_CODE_LENGTH && (
					<Button
						onClick={onContinueClicked}
						htmlType="button"
						type="primary"
						loading={formDisabled}
						disabled={!isValid}
						className="w-full"
					>
						{formDisabled ? 'Continue...' : 'Continue'}
					</Button>
				)}
			</Form>
		</>
	);
};
