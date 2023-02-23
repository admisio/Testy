import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';
import { exportCsv } from '$lib/utils/csvExport';
import { userAuth } from '../middleware/userAuth';

export const feedback = t.router({
    list: t.procedure.use(adminAuth).query(async () => await prisma.feedback.findMany()),

    create: t.procedure
        .use(userAuth)
        .input(
            z.object({
                feedback: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            await prisma.feedback.create({
                data: {
                    content: input.feedback,
                    user: {
                        connect: {
                            id: Number(ctx.userId)
                        }
                    }
                }
            });
        }),
    csv: t.procedure.use(adminAuth).query(async () => exportCsv())
});
