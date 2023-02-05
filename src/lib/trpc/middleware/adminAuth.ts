import { t } from '$lib/trpc/t';
import { TRPCError } from '@trpc/server';

export const adminAuth = t.middleware(async ({ next, ctx }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  
  return next();
});
