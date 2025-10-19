import { createEvent, createStore, sample } from 'effector';

import { signInLoginFactory } from '~/features/sign-in/login-form';
import { signInTfaFactory } from '~/features/sign-in/tfa-form';

import { routes } from '~/shared/router';

export const currentRoute = routes.signIn;

export const backClicked = createEvent();

export const signInLogin = signInLoginFactory();

export const signInTfa = signInTfaFactory();

export const $viewPhase = createStore<'login' | 'tfa' | 'finish'>('login');

export const $tfaSessionId = createStore<string | null>(null);

sample({
	clock: signInLogin.output.tfaRequired,
	filter: (payload) => payload.sessionId !== '',
	fn: (payload) => payload.sessionId,
	target: $tfaSessionId,
});

sample({
	clock: signInLogin.output.tfaRequired,
	fn: () => 'tfa' as const,
	target: $viewPhase,
});

sample({
	clock: signInLogin.output.tfaRequired,
	target: signInTfa.input.start,
});

sample({
	clock: [signInLogin.output.finished, signInTfa.output.finished],
	fn: () => 'finish' as const,
	target: $viewPhase,
});

sample({
	clock: backClicked,
	target: [signInTfa.input.abort, $viewPhase.reinit, $tfaSessionId.reinit],
});

sample({
	clock: currentRoute.closed,
	target: [signInTfa.input.abort, signInLogin.input.abort, $viewPhase.reinit, $tfaSessionId.reinit],
});
