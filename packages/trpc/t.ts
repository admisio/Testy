import type { Context } from './server/createContext';
import { initTRPC } from '@trpc/server';

export const t = initTRPC.context<Context>().create();
