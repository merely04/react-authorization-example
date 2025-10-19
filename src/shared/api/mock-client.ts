import { createEffect } from 'effector';

import { USE_MOCK_API } from '../config';
import {
	type AuthLoginPost,
	type AuthLoginPostDone,
	type AuthLoginPostFail,
	type AuthLoginTfaPost,
	type AuthLoginTfaPostDone,
	type AuthLoginTfaPostFail,
	authLoginPostFx as originalAuthLoginPostFx,
	authLoginTfaPostFx as originalAuthLoginTfaPostFx,
} from './client';
import { mockAuthLoginPost, mockAuthLoginTfaPost } from './mock';

export const authLoginPostFx = USE_MOCK_API
	? createEffect<AuthLoginPost, AuthLoginPostDone, AuthLoginPostFail>({
			async handler(params) {
				return await mockAuthLoginPost(params);
			},
		})
	: originalAuthLoginPostFx;

export const authLoginTfaPostFx = USE_MOCK_API
	? createEffect<AuthLoginTfaPost, AuthLoginTfaPostDone, AuthLoginTfaPostFail>({
			async handler(params) {
				return await mockAuthLoginTfaPost(params);
			},
		})
	: originalAuthLoginTfaPostFx;

export type {
	AuthLoginPost,
	AuthLoginPostDone,
	AuthLoginPostFail,
	AuthLoginTfaPost,
	AuthLoginTfaPostDone,
	AuthLoginTfaPostFail,
	GenericErrors,
} from './client';

export {
	authLoginPostOk,
	authLoginPostAccepted,
	authLoginPostBadRequest,
	authLoginPostUnauthorized,
	authLoginPostTooManyRequests,
	authLoginPostInternalServerError,
	authLoginTfaPostOk,
	authLoginTfaPostBadRequest,
	authLoginTfaPostUnauthorized,
	authLoginTfaPostNotFound,
	authLoginTfaPostTooManyRequests,
	authLoginTfaPostInternalServerError,
} from './client';
