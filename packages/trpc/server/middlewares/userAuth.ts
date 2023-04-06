import { TRPCError } from '@trpc/server';
import { t } from '../trpc';
import { trpcInfo } from '../../utils/logging';

export const userAuth = t.middleware(async ({ next, ctx, rawInput, meta, path, type }) => {
    if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    trpcInfo(ctx, `${type} ${path} ${meta ?? ''} USER AUTHENTICATED (INPUT: ${JSON.stringify(rawInput)})`);

    return next();
});
