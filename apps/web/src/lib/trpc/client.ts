import type { Router } from '@testy/trpc/server/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init?: TRPCClientInit) {
    if (typeof window === 'undefined') return createTRPCClient<Router>({ init });
    if (!browserClient) browserClient = createTRPCClient<Router>();
    return browserClient;
}
