import { PUBLIC_API_URL, PUBLIC_COOKIE_DOMAIN } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import { type Actions } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	console.log('logout +page.server.ts LOAD locals : ', locals);
	console.log('\n');

	return { locals };
};

export const actions = {
	logout: async ({ cookies, fetch, locals }) => {
		console.log('locals : ', locals);
		console.log('\n');
		console.log('process.env.NODE_ENV : ', process.env.NODE_ENV);
		console.log('\n');

		try {
			const response = await fetch(PUBLIC_API_URL + '/auth/logout', {
				// https://docs.directus.io/reference/authentication.html#logout
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				// https://docs.directus.io/reference/authentication.html#request-body-4
				body: JSON.stringify({
					mode: 'session'
				}),
				credentials: 'include'
			});

			console.log('directus logout response : ', response);
			console.log('\n');

			// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
			// successful response
			if (response.status === 204) {
				// delete the cookie with the session_token
				cookies.delete('session_token', { path: '/', domain: `${PUBLIC_COOKIE_DOMAIN}` });

				//
				// https://svelte.dev/docs/kit/form-actions#Loading-data
				// clear locals
				locals = {};

				return {
					status: response.status,
					statusText: response.statusText,
					message: 'Log Out Successful'
				};
			}

			if (response.status >= 400) {
				// delete the cookie with the session_token
				cookies.delete('session_token', { path: '/', domain: `${PUBLIC_COOKIE_DOMAIN}` });

				//
				// https://svelte.dev/docs/kit/form-actions#Loading-data
				// clear locals
				locals = {};

				return {
					status: response.status,
					statusText: response.statusText,
					message: '...'
				};
			}
		} catch (err) {
			//
			// https://svelte.dev/docs/kit/form-actions#Loading-data
			// clear locals
			locals = {};

			console.log('err : ', err);
			return fail(400, { message: err });
		}
	}
} satisfies Actions;
