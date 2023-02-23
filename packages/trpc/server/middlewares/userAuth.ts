import { TRPCError } from '@trpc/server';
import { t } from '../trpc';

export const userAuth = t.middleware(async ({ next, ctx }) => {
    if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next();
  });
  