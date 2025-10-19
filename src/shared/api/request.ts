import { createEffect, createStore } from 'effector';
import ky, { type SearchParamsOption } from 'ky';

import { API_URL } from '../config';

export const $accessToken = createStore<string | null>(null);

const localApi = ky.create({
	prefixUrl: API_URL,
	hooks: {
		beforeRequest: [
			(request) => {
				// eslint-disable-next-line effector/no-getState
				const accessToken = $accessToken.getState();
				if (accessToken) {
					request.headers.set('Authorization', `Bearer ${accessToken}`);
				}
			},
		],
	},
});

interface Request {
	path: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: unknown;
	query?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requestFx = createEffect<Request, any>((request) => {
	return localApi(request.path.slice(1), {
		method: request.method,
		json: request.body,
		searchParams: request.query as SearchParamsOption | undefined,
	})
		.then(async (response) => {
			let body = null;

			try {
				body = await response.json();
			} catch {
				// ignored
			}

			return { status: response.status, body };
		})
		.catch(async (error) => {
			if (error.name !== 'HTTPError') {
				return {
					status: 501,
					body: { message: 'No connection' },
				};
			}

			return { status: error.response.status, body: await error.response.json() };
		});
});
