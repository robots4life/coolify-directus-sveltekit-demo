import { PUBLIC_API_URL, PUBLIC_COOKIE_DOMAIN } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import { type Actions } from '@sveltejs/kit';
import {
	constructCookieOpts,
	getDirectusAuthSessionCredentialsInstance
} from '$lib/server/directus';
import * as set_cookie_parser from 'set-cookie-parser';
import { readMe } from '@directus/sdk';

export const load = async ({ locals }) => {
	console.log('login +page.server.ts LOAD locals : ', locals);
	console.log('\n');

	return { locals };
};

export const actions = {
	login: async ({ cookies, fetch, request, locals }) => {
		const data = await request.formData();
		const email = String(data.get('email'));
		const password = String(data.get('password'));

		const sessionToken = cookies.get('session_token');
		console.log('sessionToken : ', sessionToken);
		console.log('\n');

		if (sessionToken === undefined) {
			try {
				const response = await fetch(PUBLIC_API_URL + '/auth/login', {
					// https://docs.directus.io/reference/authentication.html#request-2
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					// https://docs.directus.io/reference/authentication.html#request-body-2
					body: JSON.stringify({
						mode: 'session',
						email,
						password
					}),
					credentials: 'include'
				});

				console.log('directus login response : ', response);
				console.log('\n');

				const { headers } = response;
				console.log('directus login response headers : ', headers);
				console.log('\n');

				for (const setCookieString of set_cookie_parser.splitCookiesString(
					String(headers.get('set-cookie'))
				)) {
					console.log('\n');
					console.log('setCookieString : ', setCookieString);
					console.log('\n');

					const { name, value, ...options } = set_cookie_parser.parseString(setCookieString);
					console.log('name : ', name);
					console.log('\n');
					console.log('value : ', value);
					console.log('\n');
					console.log('options : ', options);
					console.log('\n');

					// create a date object from the expires options
					const expiryDate = options.expires ? new Date(options.expires) : undefined;

					if (expiryDate && response.status === 200) {
						//
						// calculate max-age in seconds and minutes
						const maxAgeInSeconds = Math.floor(
							(expiryDate.getTime() - new Date().getTime()) / 1000
						);
						const maxAgeInMinutes = Math.floor(maxAgeInSeconds / 60);

						console.log(`Max-Age in seconds: ${maxAgeInSeconds}`);
						console.log('\n');
						console.log(`Max-Age in minutes: ${maxAgeInMinutes}`);
						console.log('\n');

						// set the cookie with the session_token
						// use the options from the returned set-cookie headers options
						// and the calculated maxAgeInSeconds
						cookies.set('session_token', value, constructCookieOpts(maxAgeInSeconds));

						return {
							status: response.status,
							statusText: response.statusText,
							message: 'Log In Successful'
						};
					}
				}
			} catch (err) {
				console.log('err : ', err);
				return fail(400, { message: err });
			}
		}

		// verify if a session token is still valid in Directus
		// this is called when the user has logged in but submits the login form a second time
		// this is here on purpose to show how an existing sessionToken can be verified with the Directus API
		if (sessionToken) {
			//
			// getDirectusAuthSessionCredentialsInstance has an options object as arguments
			// the options object can have "fetch" or "session" or both
			const client = getDirectusAuthSessionCredentialsInstance({ session: sessionToken });

			try {
				// https://docs.directus.io/reference/system/users.html#retrieve-the-current-user
				// try to get the currently authenticated user
				const response = await client.request(readMe());

				// if this succeeds then the sessionToken is valid and the current user is already logged in
				if (response.id === locals.user_id && response.role === locals.user_role) {
					console.log('directus /users/me response : ', response);
					console.log('\n');

					return {
						status: response.id,
						statusText: response.role,
						message: 'Current User Is Already Logged In With A Valid Session'
					};
				}
			} catch (error) {
				console.log('error : ', error);
				//
				// https://svelte.dev/docs/kit/form-actions#Loading-data
				// clear locals
				locals = {};

				cookies.delete('session_token', { path: '/', domain: `${PUBLIC_COOKIE_DOMAIN}` });

				return {
					status: error.response.status,
					statusText: error.response.statusText,
					message: JSON.stringify(error)
				};
			}
		}
	}
} satisfies Actions;
