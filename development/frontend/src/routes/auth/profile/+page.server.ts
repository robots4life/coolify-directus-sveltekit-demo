import { getDirectusAuthSessionCredentialsInstance } from '$lib/server/directus';
import { readMe } from '@directus/sdk';

export const load = async ({ cookies, locals }) => {
	console.log('profile +page.server.ts locals : ', locals);
	console.log('\n');

	// getDirectusAuthSessionCredentialsInstance has an options object as arguments
	// the options object can have "fetch" or "session" or both
	const client = getDirectusAuthSessionCredentialsInstance({ session: locals.session_token });

	try {
		// try to get the currently authenticated user
		const response = await client.request(readMe());

		// if this succeeds then the sessionToken is valid and the current user is logged in
		if (response.id === locals.user_id && response.role === locals.user_role) {
			console.log('directus /users/me response : ', response);
			console.log('\n');

			return {
				user: response,
				locals
			};
		}
	} catch (error) {
		console.log('error : ', error);

		// https://svelte.dev/docs/kit/form-actions#Loading-data
		// clear locals
		locals = {};

		cookies.delete('session_token', { path: '/' });

		return {
			status: error.response.status,
			statusText: error.response.statusText,
			message: JSON.stringify(error)
		};
	}
};
