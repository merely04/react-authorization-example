import { ExclamationCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useForm } from '@effector-reform/react';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useUnit } from 'effector-react';

import type { signInLoginFactory } from './model';

interface SignInLoginFormProps {
	model: signInLoginFactory;
}

export const SignInLoginForm = (props: SignInLoginFormProps) => {
	const { model } = props;

	const { fields } = useForm(model.form);

	const [submitDisabled, formDisabled, error, onSubmit, clearError] = useUnit([
		model.$submitDisabled,
		model.$formDisabled,
		model.$error,
		model.form.submit,
		model.clearError,
	]);

	return (
		<>
			<Typography.Title level={3} className="mt-[4px] px-[10px] text-center">
				Sign in to your account to continue
			</Typography.Title>

			<Form
				disabled={formDisabled}
				initialValues={{ remember: true }}
				onFinish={onSubmit}
				layout="vertical"
				size="large"
				className="flex flex-col gap-[16px] !mt-[24px]"
			>
				<Form.Item
					name="email"
					validateStatus={fields.email.error ? 'error' : ''}
					help={fields.email.error}
					required={true}
					className="!mb-0"
				>
					<Input
						placeholder="Email"
						prefix={<UserOutlined className="opacity-45" />}
						value={fields.email.value}
						onChange={(e) => fields.email.onChange(e.currentTarget.value)}
						onBlur={fields.email.onBlur}
					/>
				</Form.Item>

				<Form.Item
					name="password"
					validateStatus={fields.password.error ? 'error' : ''}
					help={fields.password.error}
					required={true}
					className="!mb-0"
				>
					<Input.Password
						placeholder="Password"
						visibilityToggle={false}
						prefix={<LockOutlined className="opacity-45" />}
						value={fields.password.value}
						onChange={(e) => fields.password.onChange(e.currentTarget.value)}
						onBlur={fields.password.onBlur}
					/>
				</Form.Item>

				<Button
					htmlType="submit"
					type="primary"
					disabled={formDisabled || submitDisabled}
					className="w-full"
				>
					{formDisabled ? 'Signing in...' : 'Log in'}
				</Button>

				{error && (
					<Alert
						message={error}
						type="error"
						icon={<ExclamationCircleOutlined />}
						showIcon
						closable
						onClose={clearError}
						className="mb-4"
					/>
				)}
			</Form>
		</>
	);
};
