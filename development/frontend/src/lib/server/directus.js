// https://svelte.dev/docs/kit/server-only-modules
// https://svelte.dev/docs/kit/server-only-modules#Your-modules
// this file is stored in "$lib/server"
// this means that all this logic will only ever be available on the server

// https://docs.directus.io/use-cases/headless-cms/security.html#obscure-access-tokens-and-urls
// Call your API from the server-side.
// Frontend frameworks have "server" routes that you can setup that are only called from the server, never on the client.

import { PUBLIC_API_URL, PUBLIC_COOKIE_DOMAIN } from '$env/static/public';
import { createDirectus, authentication, rest } from '@directus/sdk';

/**
 * Creates and returns a Directus instance with authentication in session mode with credentials and optional SvelteKit fetch override.
 * This instance can be used to query private data from the Directus API.
 *
 * @param {Object} [options={}] - Options object for configuration.
 * @param {import('@sveltejs/kit').LoadEvent['fetch']=} options.fetch - Optional custom fetch function from SvelteKit.
 * @param {string=} options.session - Optional session token from Directus.
 */
export function getDirectusAuthSessionCredentialsInstance({ fetch, session } = {}) {
	/**
	 * If the fetch function is available (truthy), it adds SvelteKit's fetch to a globals property inside options. Otherwise it sets options to an empty object.
	 * This is used in SvelteKit to pass the custom fetch implementation for SSR or API handling.
	 */
	const options = fetch ? { globals: { fetch } } : {};

	const directus = createDirectus(PUBLIC_API_URL, options)
		.with(authentication('session', { credentials: 'include' }))
		.with(rest({ credentials: 'include' }));

	/**
	 * If a session token is provided then it is added to the Directus instance for authenticated requests to the Directus API.
	 * Using this, for example with a request to readMe() you can verify if the current user is logged in with a valid session.
	 */
	if (session) directus.setToken(session);

	return directus;
}

/**
 * Creates and returns a public Directus instance with optional fetch override to query public data from the Directus API where no authentication is needed.
 *
 * @param {import('@sveltejs/kit').LoadEvent['fetch']=} fetch - Optional custom fetch function from SvelteKit.
 */

export function getPublicDirectusInstance(fetch) {
	const options = fetch ? { globals: { fetch } } : {};
	const directus = createDirectus(PUBLIC_API_URL, options).with(rest());

	return directus;
}

/**
 * Creates and returns a cookie with options.
 *
 * @param {number} age - Age of the cookie as a number in seconds
 * @param {boolean | "strict" | "lax" | "none"} sameSite - SameSite option for the cookie
 */
export const constructCookieOpts = (age, sameSite = 'strict') => {
	return {
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#domaindomain-value
		// the domain for the cookie
		domain: PUBLIC_COOKIE_DOMAIN,

		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#pathpath-value
		// send cookie for every page with "/" or change it to a path the cookie should be valid for
		path: '/',

		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#httponly
		// server side only cookie so you can't use `document.cookie`
		httpOnly: true,

		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
		// only requests from same site can send cookies
		// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
		sameSite,

		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#secure
		// only sent over HTTPS in production
		// https://vite.dev/guide/env-and-mode.html
		secure: import.meta.env.MODE === 'production',
		// secure: process.env.NODE_ENV === 'production',

		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#max-agenumber
		// set cookie to expire after a given time in seconds
		maxAge: age
	};
};
