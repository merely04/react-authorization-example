import { BugOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Select, Space, Typography } from 'antd';
import { useState } from 'react';

import { type MockScenario, resetMockState, setMockScenario } from '~/shared/api';

const { Text } = Typography;

const mockScenarios: {
	value: MockScenario;
	label: string;
	description: string;
	testInfo: string;
}[] = [
	{
		value: 'success',
		label: 'Успешный вход',
		description: 'Успешная авторизация без TFA',
		testInfo: 'Введите любой email и пароль (минимум 8 символов)',
	},
	{
		value: 'success-tfa',
		label: 'Успешный вход с TFA',
		description: 'Требуется ввод TFA кода',
		testInfo: 'Введите email: tfa@example.com',
	},
	{
		value: 'invalid-credentials',
		label: 'Неверные учетные данные',
		description: 'Ошибка 401 - неправильный email или пароль',
		testInfo: 'Введите email: invalid@example.com',
	},
	{
		value: 'missing-fields',
		label: 'Отсутствующие поля',
		description: 'Ошибка 400 - не все поля заполнены',
		testInfo: 'Оставьте email или пароль пустым',
	},
	{
		value: 'rate-limit',
		label: 'Rate Limiting',
		description: 'Ошибка 429 - слишком много попыток',
		testInfo: 'Введите email: ratelimit@example.com',
	},
	{
		value: 'server-error',
		label: 'Ошибка сервера',
		description: 'Ошибка 500 - внутренняя ошибка сервера',
		testInfo: 'Введите email: error@example.com',
	},
	{
		value: 'network-error',
		label: 'Ошибка сети',
		description: 'Отсутствие подключения к интернету',
		testInfo: 'Установите этот сценарий для тестирования офлайн режима',
	},
];

const tfaScenarios: {
	value: MockScenario;
	label: string;
	description: string;
	testInfo: string;
}[] = [
	{
		value: 'success',
		label: 'Успешная верификация',
		description: 'TFA код принят',
		testInfo: 'Введите код: 123456',
	},
	{
		value: 'tfa-invalid-code',
		label: 'Неверный TFA код',
		description: 'Ошибка 401 - неправильный код',
		testInfo: 'Введите любой код, кроме 123456',
	},
	{
		value: 'tfa-expired-session',
		label: 'Просроченная сессия',
		description: 'Ошибка 404 - сессия TFA истекла',
		testInfo: 'Сначала войдите с другим email, затем попробуйте старую сессию',
	},
	{
		value: 'tfa-rate-limit',
		label: 'TFA Rate Limit',
		description: 'Ошибка 429 - слишком много попыток TFA',
		testInfo: 'Введите код: 999999',
	},
	{
		value: 'tfa-server-error',
		label: 'Ошибка TFA сервера',
		description: 'Ошибка 500 при верификации TFA',
		testInfo: 'Этот сценарий вызовет ошибку сервера при проверке TFA',
	},
];

interface DebugMenuProps {
	className?: string;
}

export const DebugMenu = ({ className }: DebugMenuProps) => {
	const [currentScenario, setCurrentScenario] = useState<MockScenario>('success');
	const [currentTfaScenario, setCurrentTfaScenario] = useState<MockScenario>('success');

	const handleScenarioChange = (scenario: MockScenario) => {
		setCurrentScenario(scenario);
		setMockScenario(scenario);
	};

	const handleTfaScenarioChange = (scenario: MockScenario) => {
		setCurrentTfaScenario(scenario);
		setMockScenario(scenario);
	};

	const handleReset = () => {
		setCurrentScenario('success');
		setCurrentTfaScenario('success');
		resetMockState();
	};

	const selectedLoginScenario = mockScenarios.find((s) => s.value === currentScenario);
	const selectedTfaScenario = tfaScenarios.find((s) => s.value === currentTfaScenario);

	return (
		<div className={`fixed bottom-4 right-4 z-50 ${className || ''}`}>
			<Collapse
				size="small"
				ghost
				items={[
					{
						key: 'debug',
						label: (
							<div className="flex items-center gap-2">
								<BugOutlined className="text-red-500" />
								<Text className="text-xs">Debug</Text>
							</div>
						),
						children: (
							<Card
								title="Mock API Управление"
								size="small"
								style={{ width: 400 }}
								className="shadow-lg"
							>
								<Space direction="vertical" size="middle" style={{ width: '100%' }}>
									<div>
										<Text strong>Сценарии входа:</Text>
										<Select
											value={currentScenario}
											onChange={handleScenarioChange}
											style={{ width: '100%', marginTop: 4 }}
											options={mockScenarios.map((scenario) => ({
												value: scenario.value,
												label: scenario.label,
											}))}
										/>
										{selectedLoginScenario && (
											<Text className="text-xs text-gray-500 mt-1 block">
												{selectedLoginScenario.testInfo}
											</Text>
										)}
									</div>

									<div>
										<Text strong>Сценарии TFA:</Text>
										<Select
											value={currentTfaScenario}
											onChange={handleTfaScenarioChange}
											style={{ width: '100%', marginTop: 4 }}
											options={tfaScenarios.map((scenario) => ({
												value: scenario.value,
												label: scenario.label,
											}))}
										/>
										{selectedTfaScenario && (
											<Text className="text-xs text-gray-500 mt-1 block">
												{selectedTfaScenario.testInfo}
											</Text>
										)}
									</div>

									<Button onClick={handleReset} type="default" size="small" className="w-full">
										Сбросить настройки
									</Button>
								</Space>
							</Card>
						),
					},
				]}
			/>
		</div>
	);
};
