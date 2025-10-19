import { createForm } from '@effector-reform/core';
import { yupAdapter } from '@effector-reform/yup';
import { attach, combine, createEvent, createStore, sample } from 'effector';
import { object, string } from 'yup';

import { type AuthLoginPost, authLoginPostFx } from '~/shared/api';

export const signInLoginFactory = () => {
	const input = {
		start: createEvent(),
		abort: createEvent(),
	};

	const output = {
		finished: createEvent(),
		tfaRequired: createEvent<{ sessionId: string }>(),
	};

	const clearError = createEvent();

	const loginFx = attach({
		effect: authLoginPostFx,
	});

	const form = createForm({
		schema: {
			email: '',
			password: '',
		},
		validation: yupAdapter(
			object({
				email: string().email('Email must be valid'),
				password: string().min(8, 'Min length 8'),
			}),
		),
		validationStrategies: ['blur', 'submit'],
	});

	const $submitDisabled = combine(
		form.$values,
		(fields) => !fields.email.length && !fields.password.length,
	);

	const $formDisabled = loginFx.pending;

	const $error = createStore<string | null>(null);

	sample({
		clock: loginFx.failData,
		fn: (error) => {
			if ('error' in error.error) {
				return error.error.error!;
			}

			const mappedError = {
				bad_request: 'Invalid data format',
				unauthorized: 'Incorrect email or password',
				too_many_requests: 'Too many login attempts. Please try again later.',
				internal_server_error: 'Internal server error',
				unexpected: 'Network error. Please check your internet connection.',
				unknown_status: `Unknown error (${'status' in error.error ? error.error.status : 'unknown'})`,
				validation_error: 'Validation error',
			}[error.status];

			return mappedError ?? 'An unknown error occurred';
		},
		target: $error,
	});

	sample({
		clock: [loginFx.doneData, form.changed, clearError],
		fn: () => null,
		target: $error,
	});

	sample({
		clock: form.validatedAndSubmitted,
		fn: (fields): AuthLoginPost => ({
			body: {
				email: fields.email,
				password: fields.password,
			},
		}),
		target: loginFx,
	});

	sample({
		clock: loginFx.doneData,
		filter: (payload) => payload.status === 'ok',
		target: output.finished,
	});

	sample({
		clock: loginFx.doneData,
		filter: (payload) => payload.status === 'accepted',
		fn: (payload) => {
			if (payload.status === 'accepted') {
				return { sessionId: payload.answer.tfa_session_id! };
			}
			return { sessionId: '' };
		},
		target: output.tfaRequired,
	});

	sample({
		clock: input.abort,
		target: form.reset,
	});

	return {
		input,
		output,
		form,
		$submitDisabled,
		$formDisabled,
		$error,
		clearError,
	};
};

export type signInLoginFactory = ReturnType<typeof signInLoginFactory>;
