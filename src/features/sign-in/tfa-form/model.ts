import { createForm } from '@effector-reform/core';
import { yupAdapter } from '@effector-reform/yup';
import { attach, createEvent, sample } from 'effector';
import { object, string } from 'yup';

import { type AuthLoginTfaPost, authLoginTfaPostFx } from '~/shared/api';

import { TFA_CODE_LENGTH } from './constants';

export const signInTfaFactory = () => {
	const input = {
		start: createEvent<{ sessionId: string }>(),
		abort: createEvent(),
	};

	const output = {
		finished: createEvent(),
	};

	const continueClicked = createEvent();

	const tfaConfirmFx = attach({
		effect: authLoginTfaPostFx,
	});

	const form = createForm({
		schema: {
			sessionId: '',
			code: '',
		},
		validation: yupAdapter(
			object({
				sessionId: string(),
				code: string().length(6, 'Enter all numbers'),
			}),
		),
		validationStrategies: ['blur', 'submit'],
	});

	const $formDisabled = tfaConfirmFx.pending;

	sample({
		clock: input.start,
		fn: (payload) => payload.sessionId,
		target: form.fields.sessionId.change,
	});

	sample({
		clock: form.fields.code.changed,
		source: form.$values,
		filter: (_, code) => code.length === TFA_CODE_LENGTH,
		fn: (fields, code): AuthLoginTfaPost => ({
			body: {
				tfa_session_id: fields.sessionId,
				tfa_code: code,
			},
		}),
		target: tfaConfirmFx,
	});

	sample({
		clock: continueClicked,
		target: output.finished,
	});

	sample({
		clock: tfaConfirmFx.failData,
		fn: (error) => {
			if ('error' in error.error) {
				return error.error.error!;
			}

			const mappedError = {
				bad_request: 'Invalid TFA code format',
				unauthorized: 'Incorrect TFA code',
				not_found: 'TFA session not found or expired',
				too_many_requests: 'Too many TFA code attempts',
				internal_server_error: 'Internal server error',
				unexpected: 'Network error. Please check your internet connection.',
				unknown_status: `Unknown error (${'status' in error.error ? error.error.status : 'unknown'})`,
				validation_error: 'Data validation error',
			}[error.status];

			return mappedError ?? 'An unknown error has occurred';
		},
		target: form.fields.code.changeError,
	});

	sample({
		clock: [tfaConfirmFx.doneData, form.changed],
		fn: () => null,
		target: form.fields.code.changeError,
	});

	sample({
		clock: input.abort,
		target: form.reset,
	});

	return {
		input,
		output,
		continueClicked,
		form,
		$formDisabled,
	};
};

export type signInTfaFactory = ReturnType<typeof signInTfaFactory>;
