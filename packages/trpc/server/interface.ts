/** 
 * SvelteKit compatible RequestEvent interface 
 */


declare namespace App {
	/**
	 * Defines the common shape of expected and unexpected errors. Expected errors are thrown using the `error` function. Unexpected errors are handled by the `handleError` hooks which should return this shape.
	 */
	export interface Error {
		message: string;
	}

	/**
	 * The interface that defines `event.locals`, which can be accessed in [hooks](https://kit.svelte.dev/docs/hooks) (`handle`, and `handleError`), server-only `load` functions, and `+server.js` files.
	 */
	export interface Locals {}

	/**
	 * Defines the common shape of the [$page.data store](https://kit.svelte.dev/docs/modules#$app-stores-page) - that is, the data that is shared between all pages.
	 * The `Load` and `ServerLoad` functions in `./$types` will be narrowed accordingly.
	 * Use optional properties for data that is only present on specific pages. Do not add an index signature (`[key: string]: any`).
	 */
	export interface PageData {}

	/**
	 * If your adapter provides [platform-specific context](https://kit.svelte.dev/docs/adapters#platform-specific-context) via `event.platform`, you can specify it here.
	 */
	export interface Platform {}
}

export interface Cookies {
	/**
	 * Gets a cookie that was previously set with `cookies.set`, or from the request headers.
	 * @param name the name of the cookie
	 * @param opts the options, passed directly to `cookie.parse`. See documentation [here](https://github.com/jshttp/cookie#cookieparsestr-options)
	 */
	get(name: string, opts?: import('cookie').CookieParseOptions): string | undefined;

	/**
	 * Sets a cookie. This will add a `set-cookie` header to the response, but also make the cookie available via `cookies.get` during the current request.
	 *
	 * The `httpOnly` and `secure` options are `true` by default (except on http://localhost, where `secure` is `false`), and must be explicitly disabled if you want cookies to be readable by client-side JavaScript and/or transmitted over HTTP. The `sameSite` option defaults to `lax`.
	 *
	 * By default, the `path` of a cookie is the 'directory' of the current pathname. In most cases you should explicitly set `path: '/'` to make the cookie available throughout your app.
	 * @param name the name of the cookie
	 * @param value the cookie value
	 * @param opts the options, passed directory to `cookie.serialize`. See documentation [here](https://github.com/jshttp/cookie#cookieserializename-value-options)
	 */
	set(name: string, value: string, opts?: import('cookie').CookieSerializeOptions): void;

	/**
	 * Deletes a cookie by setting its value to an empty string and setting the expiry date in the past.
	 *
	 * By default, the `path` of a cookie is the 'directory' of the current pathname. In most cases you should explicitly set `path: '/'` to make the cookie available throughout your app.
	 * @param name the name of the cookie
	 * @param opts the options, passed directory to `cookie.serialize`. The `path` must match the path of the cookie you want to delete. See documentation [here](https://github.com/jshttp/cookie#cookieserializename-value-options)
	 */
	delete(name: string, opts?: import('cookie').CookieSerializeOptions): void;

	/**
	 * Serialize a cookie name-value pair into a `Set-Cookie` header string, but don't apply it to the response.
	 *
	 * The `httpOnly` and `secure` options are `true` by default (except on http://localhost, where `secure` is `false`), and must be explicitly disabled if you want cookies to be readable by client-side JavaScript and/or transmitted over HTTP. The `sameSite` option defaults to `lax`.
	 *
	 * By default, the `path` of a cookie is the current pathname. In most cases you should explicitly set `path: '/'` to make the cookie available throughout your app.
	 *
	 * @param name the name of the cookie
	 * @param value the cookie value
	 * @param opts the options, passed directory to `cookie.serialize`. See documentation [here](https://github.com/jshttp/cookie#cookieserializename-value-options)
	 */
	serialize(name: string, value: string, opts?: import('cookie').CookieSerializeOptions): string;
}

export interface RequestEvent<
	Params extends Partial<Record<string, string>> = Partial<Record<string, string>>,
	RouteId extends string | null = string | null
> {
	/**
	 * Get or set cookies related to the current request
	 */
	cookies: Cookies;
	/**
	 * `fetch` is equivalent to the [native `fetch` web API](https://developer.mozilla.org/en-US/docs/Web/API/fetch), with a few additional features:
	 *
	 * - it can be used to make credentialed requests on the server, as it inherits the `cookie` and `authorization` headers for the page request
	 * - it can make relative requests on the server (ordinarily, `fetch` requires a URL with an origin when used in a server context)
	 * - internal requests (e.g. for `+server.js` routes) go directly to the handler function when running on the server, without the overhead of an HTTP call
	 *
	 * > Cookies will only be passed through if the target host is the same as the SvelteKit application or a more specific subdomain of it.
	 */
	fetch: typeof fetch;
	/**
	 * The client's IP address, set by the adapter.
	 */
	getClientAddress(): string;
	/**
	 * Contains custom data that was added to the request within the [`handle hook`](https://kit.svelte.dev/docs/hooks#server-hooks-handle).
	 */
	locals: App.Locals;
	/**
	 * The parameters of the current page or endpoint - e.g. for a route like `/blog/[slug]`, a `{ slug: string }` object
	 */
	params: Params;
	/**
	 * Additional data made available through the adapter.
	 */
	platform: Readonly<App.Platform> | undefined;
	/**
	 * The original request object
	 */
	request: Request;
	/**
	 * Info about the current route
	 */
	route: {
		/**
		 * The ID of the current route - e.g. for `src/routes/blog/[slug]`, it would be `/blog/[slug]`
		 */
		id: RouteId;
	};
	/**
	 * If you need to set headers for the response, you can do so using the this method. This is useful if you want the page to be cached, for example:
	 *
	 *	```js
	 *	/// file: src/routes/blog/+page.js
	 *	export async function load({ fetch, setHeaders }) {
	 *		const url = `https://cms.example.com/articles.json`;
	 *		const response = await fetch(url);
	 *
	 *		setHeaders({
	 *			age: response.headers.get('age'),
	 *			'cache-control': response.headers.get('cache-control')
	 *		});
	 *
	 *		return response.json();
	 *	}
	 *	```
	 *
	 * Setting the same header multiple times (even in separate `load` functions) is an error — you can only set a given header once.
	 *
	 * You cannot add a `set-cookie` header with `setHeaders` — use the [`cookies`](https://kit.svelte.dev/docs/types#public-types-cookies) API instead.
	 */
	setHeaders(headers: Record<string, string>): void;
	/**
	 * The URL of the current page or endpoint.
	 */
	url: URL;
	/**
	 * `true` if the request comes from the client asking for `+page/layout.server.js` data. The `url` property will be stripped of the internal information
	 * related to the data request in this case. Use this property instead if the distinction is important to you.
	 */
	isDataRequest: boolean;
}