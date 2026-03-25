import { storyblokFetch } from '$lib/storyblok';
import { PUBLIC_STORYBLOK_VERSION } from '$env/static/public';

// if you want to generate a static html file
// for your page.
// Documentation: https://kit.svelte.dev/docs/page-options#prerender
export const prerender = true;

//If you want to Generate a SPA
//You have to set ssr to false.
// This is not the case (so set it as true or comment on the line)
// Documentation: https://kit.svelte.dev/docs/page-options#ssr
export const ssr = true;

// How to manage the trailing slashes in the URLs
// By default, SvelteKit strips trailing slashes,
// meaning that a request for /about/ will result in a redirect to /about.
//The URL for the about page will be /about with 'never' (default)
//The URL for the about page will be /about/ with 'always'
//The URL for the about page will be /about/ or /about with 'ignore' (not reccomended)
// https://kit.svelte.dev/docs/page-options#trailingslash
export const trailingSlash = 'never';

export async function load({ fetch }) {
	try {
		const { data } = await storyblokFetch('cdn/stories/config', {
			version: PUBLIC_STORYBLOK_VERSION as 'draft' | 'published'
		}, fetch);
		return { config: data.story };
	} catch {
		return { config: null };
	}
}
