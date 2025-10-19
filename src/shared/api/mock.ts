import {
	type AuthLoginPost,
	type AuthLoginPostDone,
	type AuthLoginPostFail,
	type AuthLoginTfaPost,
	type AuthLoginTfaPostDone,
	type AuthLoginTfaPostFail,
} from './client';

export type MockScenario =
	| 'success'
	| 'success-tfa'
	| 'invalid-credentials'
	| 'missing-fields'
	| 'rate-limit'
	| 'server-error'
	| 'network-error'
	| 'tfa-invalid-code'
	| 'tfa-expired-session'
	| 'tfa-rate-limit'
	| 'tfa-server-error';

export const mockScenario = {
	current: 'success' as MockScenario,
	tfaSessionId: null as string | null,
	attempts: 0,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateTfaSessionId = () => {
	return 'mock-session-' + Math.random().toString(36).substr(2, 9);
};

const mockResponses = {
	success: {
		status: 200,
		body: {
			access_token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
			token_type: 'Bearer',
			expires_in: 3600,
		},
	},
	'success-tfa': {
		status: 202,
		body: {
			tfa_required: true,
			tfa_session_id: generateTfaSessionId(),
			message: 'Two-factor authentication is required',
		},
	},
	'invalid-credentials': {
		status: 401,
		body: {
			error: 'Invalid email or password',
			code: 'INVALID_CREDENTIALS',
		},
	},
	'missing-fields': {
		status: 400,
		body: {
			error: 'Email and password are required',
			code: 'MISSING_FIELDS',
		},
	},
	'rate-limit': {
		status: 429,
		body: {
			error: 'Too many login attempts. Please try again later.',
			code: 'RATE_LIMIT_EXCEEDED',
		},
	},
	'server-error': {
		status: 500,
		body: {
			error: 'Internal server error',
			code: 'INTERNAL_SERVER_ERROR',
		},
	},
	'network-error': {
		status: 501,
		body: {
			message: 'No connection',
		},
	},
	'tfa-invalid-code': {
		status: 401,
		body: {
			error: 'Invalid or incorrect TFA code',
			code: 'INVALID_TFA_CODE',
		},
	},
	'tfa-expired-session': {
		status: 404,
		body: {
			error: 'TFA session not found or expired',
			code: 'TFA_SESSION_EXPIRED',
		},
	},
	'tfa-rate-limit': {
		status: 429,
		body: {
			error: 'Too many TFA attempts. Please try again later.',
			code: 'TFA_RATE_LIMIT_EXCEEDED',
		},
	},
	'tfa-server-error': {
		status: 500,
		body: {
			error: 'Internal server error during TFA verification',
			code: 'TFA_SERVER_ERROR',
		},
	},
};

// Mock /auth/login
export const mockAuthLoginPost = async (params: AuthLoginPost): Promise<AuthLoginPostDone> => {
	console.log('Mock login request:', { scenario: mockScenario.current, params });

	await delay(800 + Math.random() * 400);

	const { email, password } = params.body;

	if (!email || !password) {
		throw {
			status: 'bad_request',
			error: mockResponses['missing-fields'].body,
		} as AuthLoginPostFail;
	}

	const currentMockScenario = {
		'tfa@example.com': 'success-tfa' as const,
		'error@example.com': 'server-error' as const,
		'ratelimit@example.com': 'rate-limit' as const,
		'invalid@example.com': 'invalid-credentials' as const,
	}[email];

	if (currentMockScenario) {
		mockScenario.current = currentMockScenario;
	}

	const response = mockResponses[mockScenario.current];

	if (response.status >= 400) {
		const errorData = {
			400: {
				status: 'bad_request',
				error: response.body,
			},
			401: {
				status: 'unauthorized',
				error: response.body,
			},
			429: {
				status: 'too_many_requests',
				error: response.body,
			},
			500: {
				status: 'internal_server_error',
				error: response.body,
			},
			501: {
				status: 'unexpected',
				error: new Error((response.body as { message: string }).message),
			},
		}[response.status] ?? {
			status: 'unknown_status',
			error: { status: response.status, body: response.body },
		};

		throw errorData as AuthLoginPostFail;
	}

	if (response.status === 202) {
		mockScenario.tfaSessionId = (response.body as { tfa_session_id: string }).tfa_session_id;
		return {
			status: 'accepted',
			answer: response.body,
		} as AuthLoginPostDone;
	}

	return {
		status: 'ok',
		answer: response.body,
	} as AuthLoginPostDone;
};

// Mock /auth/login/tfa
export const mockAuthLoginTfaPost = async (
	params: AuthLoginTfaPost,
): Promise<AuthLoginTfaPostDone> => {
	console.log('Mock TFA request:', { scenario: mockScenario.current, params });

	await delay(600 + Math.random() * 300);

	const { tfa_session_id, tfa_code } = params.body;

	if (!tfa_session_id || !tfa_code) {
		throw {
			status: 'bad_request',
			error: {
				error: 'TFA session ID and code are required',
				code: 'MISSING_TFA_FIELDS',
			},
		} as AuthLoginTfaPostFail;
	}

	if (!/^\d{6}$/.test(tfa_code)) {
		throw {
			status: 'bad_request',
			error: {
				error: 'TFA code must be 6 digits',
				code: 'INVALID_TFA_FORMAT',
			},
		} as AuthLoginTfaPostFail;
	}

	if (tfa_code === '123456') {
		mockScenario.current = 'success';
	} else if (tfa_code === '000000') {
		mockScenario.current = 'tfa-invalid-code';
	} else if (tfa_code === '999999') {
		mockScenario.current = 'tfa-rate-limit';
	} else {
		mockScenario.current = 'tfa-invalid-code';
	}

	if (mockScenario.tfaSessionId && tfa_session_id !== mockScenario.tfaSessionId) {
		mockScenario.current = 'tfa-expired-session';
	}

	const response = mockResponses[mockScenario.current];

	if (response.status >= 400) {
		const errorData = {
			400: {
				status: 'bad_request',
				error: response.body,
			},
			401: {
				status: 'unauthorized',
				error: response.body,
			},
			404: {
				status: 'not_found',
				error: response.body,
			},
			429: {
				status: 'too_many_requests',
				error: response.body,
			},
			500: {
				status: 'internal_server_error',
				error: response.body,
			},
		}[response.status] ?? {
			status: 'unknown_status',
			error: { status: response.status, body: response.body },
		};

		throw errorData as AuthLoginTfaPostFail;
	}

	return {
		status: 'ok',
		answer: response.body,
	} as AuthLoginTfaPostDone;
};

export const setMockScenario = (scenario: MockScenario) => {
	mockScenario.current = scenario;
	mockScenario.attempts = 0;
	console.log('Mock scenario set to:', scenario);
};

export const resetMockState = () => {
	mockScenario.current = 'success';
	mockScenario.tfaSessionId = null;
	mockScenario.attempts = 0;
};
