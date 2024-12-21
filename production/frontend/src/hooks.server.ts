import { PUBLIC_API_URL } from '$env/static/public';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

type JWTToken = {
	exp: number;
	id: string;
	role: string;
	session: string;
};

// https://svelte.dev/docs/kit/hooks#Server-hooks-handleFetch
export async function handleFetch({ event, request, fetch }) {
	if (request.url.startsWith(PUBLIC_API_URL)) {
		//
		console.log('PUBLIC_API_URL : ', PUBLIC_API_URL);
		console.log(
			'request.url.startsWith(PUBLIC_API_URL) : ',
			request.url.startsWith(PUBLIC_API_URL)
		);
		console.log('\n');

		// get the session token from the cookie
		const sessionToken = event.cookies.get('session_token');
		console.log('sessionToken : ', sessionToken);
		console.log('\n');

		// only for logout
		if (sessionToken) {
			// add the session_token to the Authorization and Cookie header
			const headers = new Headers(request.headers);
			if (sessionToken) {
				//
				// just Authorization on its own will not log out the session
				headers.set('Authorization', `Bearer ${sessionToken}`);
				// just Cookie on its own will log out the session
				// keep both or just Cookie, you got to have Cookie here to log out the session
				headers.set('Cookie', `session_token=${sessionToken}`);
			}

			// create a new request with merged headers
			request = new Request(request, {
				...request,
				headers
			});

			console.log('request:', request);
			console.log('\n');
		}
	}

	return fetch(request);
}

// https://svelte.dev/docs/kit/hooks#Server-hooks-handle
const handleAuthentication: Handle = async function ({ event, resolve }) {
	//
	// destructure cookies from event
	const { cookies } = event;

	// if there is a session cookie that was set during login
	if (cookies.get('session_token')) {
		//
		// get session_token from the cookie that was set during login
		const session_token = cookies.get('session_token');
		//
		// decode the session_token from the cookie that was set during login
		const session_token_data: JWTToken | null = session_token
			? (jwt.decode(session_token) as JWTToken | null)
			: null;

		console.log('hooks.server.ts : session_token_data : ', session_token_data);
		console.log('\n');

		if (session_token_data) {
			//
			// convert UNIX timestamp to date, multiply by 1000 to convert seconds to milliseconds
			const expiryDate = new Date(session_token_data.exp! * 1000);
			//
			// calculate max-age in seconds and minutes
			const maxAgeInSeconds = Math.floor((expiryDate.getTime() - new Date().getTime()) / 1000);
			const maxAgeInMinutes = Math.floor(maxAgeInSeconds / 60);

			console.log(`Max-Age in seconds: ${maxAgeInSeconds}`);
			console.log('\n');
			console.log(`Max-Age in minutes: ${maxAgeInMinutes}`);
			console.log('\n');

			// https://svelte.dev/docs/kit/hooks#Server-hooks-locals
			// add the user id from the session_token_data to the locals object
			event.locals.user_id = session_token_data?.id;

			// add the user role from the session_token_data to the locals object
			event.locals.user_role = session_token_data.role;

			// add the session_token itself to the locals object
			event.locals.session_token = session_token;

			// add the session from the session_token_data to the locals object
			event.locals.session = session_token_data.session;
		}
	}

	// if there is no session cookie then empty the locals object
	if (!cookies.get('session_token')) {
		//
		// https://svelte.dev/docs/kit/form-actions#Loading-data
		// clear locals
		event.locals = {};
	}

	return await resolve(event);
};

// https://svelte.dev/docs/kit/hooks#Server-hooks-handle
const handleAuthorization: Handle = async function ({ event, resolve }) {
	//
	// add your protected routes to this array
	//
	// as an alternative to this array you can also check the locals object
	// on each route that you want to protect for the session_token
	// if the session_token is not present on the locals object
	// you can redirect the user to a route of your choice
	const protectedRoutes = ['/auth/profile'];

	console.log('event.url.pathname : ', event.url.pathname);
	console.log(
		'protectedRoute : ',
		protectedRoutes.some((url) => event.url.pathname.startsWith(url))
	);
	console.log('\n');

	const isProtected = protectedRoutes.some((url) => event.url.pathname.startsWith(url));

	if (isProtected) {
		// check if the locals object has the user_id, user_role, token and session
		if (
			event.locals.user_id &&
			event.locals.user_role &&
			event.locals.session_token &&
			event.locals.session
		) {
			// resolve the event
			return await resolve(event);
			//
		} else {
			// if the user_id, user_role, token and session are not present on the locals object
			// you can redirect the user to a route of your choice
			//
			// this is where the is user coming from originally
			console.log('redirected from protected event.url.pathname : ', event.url.pathname);

			// native
			// return new Response(null, {
			// 	status: 303,
			// 	headers: { location: '/' }
			// });

			// SvelteKit
			return redirect(303, `/auth`);
		}
	}

	// if the route is not protected then resolve the event
	return await resolve(event);
};

const showCurrentTimeInConsole: Handle = async function ({ event, resolve }) {
	console.log('Current Time : ', new Date().toLocaleTimeString());
	console.log('                      ^');
	console.log('\n');
	return await resolve(event);
};

// https://svelte.dev/docs/kit/@sveltejs-kit-hooks#sequence
// run all the functions in a sequence
export const handle = sequence(handleAuthentication, handleAuthorization, showCurrentTimeInConsole);
