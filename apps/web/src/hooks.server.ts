import { createContext } from 'trpc/context';
import { router } from 'trpc/router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({
    router,
    createContext,
    onError: ({ type, path, error }) =>
        console.error(`Encountered error while trying to process ${type} @ ${path}:`, error)
});
