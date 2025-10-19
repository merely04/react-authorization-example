const getEnvVar = (key: string, defaultValue?: string) => {
	if (import.meta.env[key] === undefined) {
		if (defaultValue !== undefined) {
			return defaultValue;
		}

		throw new Error(`Env variable ${key} is required`);
	}
	return import.meta.env[key];
};

export const BASE_URL = import.meta.env.BASE_URL;

export const IS_DEV = import.meta.env.DEV;

export const IS_PROD = import.meta.env.PROD;

export const API_URL = getEnvVar('VITE_API_URL', '/api');

export const USE_MOCK_API = getEnvVar('VITE_USE_MOCK_API', 'false') === 'true';
