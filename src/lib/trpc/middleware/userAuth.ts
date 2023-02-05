import { t } from '$lib/trpc/t';
import { TRPCError } from '@trpc/server';

export const userAuth = t.middleware(async ({ next, ctx }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next();
});
