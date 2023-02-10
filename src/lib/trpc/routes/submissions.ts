import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';

export const submissions = t.router({
    list: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                groupId: z.number().optional()
            })
        )
        .query(async ({ ctx, input }) =>
            prisma.testSubmission.findMany({
                where: {
                    assignedTest: {
                        group: {
                            id: input.groupId
                        }
                    }
                }
            })
        )
});
