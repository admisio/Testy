import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';

const config: UserConfig = {
    plugins: [sveltekit(), WindiCSS()]
};

export default config;
