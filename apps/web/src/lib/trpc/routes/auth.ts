import { t } from '$lib/trpc/t';

import { userAuth } from '../middleware/userAuth';
import { adminAuth } from '../middleware/adminAuth';

export const auth = t.router({
    user: t.procedure.use(userAuth).query(async ({ ctx }) => {
        return ctx.userId;
    }),
    admin: t.procedure.use(adminAuth).query(async ({ ctx }) => {
        return ctx.userId;
    })
});
