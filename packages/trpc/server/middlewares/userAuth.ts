import { TRPCError } from '@trpc/server';
import { t } from '../trpc';
import { trpcInfo } from '../../utils/logging';

export const userAuth = t.middleware(async ({ next, ctx }) => {
    if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    trpcInfo(ctx, `User Authenticated`);
    return next();
});
