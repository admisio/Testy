import type { Context } from './createContext';
import { initTRPC } from '@trpc/server';


export const t = initTRPC.context<Context>().create();


export * from './middlewares/adminAuth';
export * from './middlewares/userAuth';