import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';

export const groups = t.router({
    create: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                name: z.string(),
                users: z.array(z.number())
            })
        )
        .mutation(async ({ ctx, input }) => {
            const group = await prisma.group.create({
                data: {
                    name: input.name,
                    users: {
                        connect: input.users.map((id) => ({ id }))
                    }
                }
            });
            await prisma.adminsOnGroups.create({
                data: {
                    adminId: Number(ctx.userId),
                    groupId: group.id
                }
            });
            console.log(await prisma.adminsOnGroups.findMany());
        }),
    update: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                users: z.array(z.number())
            })
        )
        .mutation(async ({ input }) => {
            await prisma.group.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    users: {
                        connect: input.users.map((id) => ({ id }))
                    }
                }
            });
        }),
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async ({ ctx }) =>
            prisma.group.findMany({
                where: {
                    admins: {
                        some: {
                            adminId: Number(ctx.userId)
                        }
                    }
                }
            })
        ),
    get: t.procedure
        .use(adminAuth)
        .input(z.number())
        .query(async ({ input }) =>
            prisma.group.findUnique({
                where: {
                    id: input
                },
                include: {
                    users: true
                }
            })
        )
});