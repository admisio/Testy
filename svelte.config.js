import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { windi } from 'svelte-windicss-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [preprocess(), windi()],
    kit: { adapter: adapter() }
};

export default config;
