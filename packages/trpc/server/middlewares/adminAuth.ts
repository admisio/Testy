import { TRPCError } from '@trpc/server';
import type { Context } from '../createContext';
import { t } from '../trpc';


export type AdminAuthResult<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
const ok = <T>(value: T): AdminAuthResult<T, never> => ({ ok: true, value });
const err = <E>(error: E): AdminAuthResult<never, E> => ({ ok: false, error });

export const adminContextValid = (ctx: Context): AdminAuthResult<null, TRPCError> => {
    if (!ctx.userId) return err(new TRPCError({ code: 'UNAUTHORIZED' }));
    if (ctx.role !== 'admin') return err(new TRPCError({ code: 'FORBIDDEN' }));
    return ok(null);
};

export const adminAuth = t.middleware(async ({ next, ctx }) => {
    if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    if (ctx.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });

    return next();
});