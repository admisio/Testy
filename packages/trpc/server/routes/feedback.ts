import { t, adminAuth, userAuth } from '../trpc';
import { z } from 'zod';
import prisma from '../../prisma';
import { exportCsv } from '../../utils/csvExport';

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
