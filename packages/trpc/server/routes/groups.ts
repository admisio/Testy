import { t, adminAuth } from '../trpc';
import { z } from 'zod';
import prisma from '../../prisma';
import { trpcInfo } from '../../utils/logging';

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

            trpcInfo(ctx, `Created group ${input.name}`);
        }),
    delete: t.procedure
        .use(adminAuth)
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            await prisma.adminsOnGroups
                .deleteMany({
                    where: {
                        groupId: input,
                        adminId: Number(ctx.userId)
                    }
                })
                .then(async () => {
                    await prisma.group.delete({
                        where: {
                            id: input
                        }
                    });
                });

            trpcInfo(ctx, `Deleted group ${input}`);
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
    addUser: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                groupId: z.number(),
                userId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            await prisma.group.update({
                where: {
                    id: input.groupId
                },
                data: {
                    users: {
                        connect: {
                            id: input.userId
                        }
                    }
                }
            });

            trpcInfo(ctx, `Added user ${input.userId} to group ${input.groupId}`);
        }),
    rename: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                groupId: z.number(),
                name: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            await prisma.group.update({
                where: {
                    id: input.groupId
                },
                data: {
                    name: input.name
                }
            });

            trpcInfo(ctx, `Renamed group ${input.groupId} to ${input.name}`);
        }),
    removeUser: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                groupId: z.number(),
                userId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            await prisma.group.update({
                where: {
                    id: input.groupId
                },
                data: {
                    users: {
                        disconnect: {
                            id: input.userId
                        }
                    }
                }
            });

            trpcInfo(ctx, `Removed user ${input.userId} from group ${input.groupId}`);
        }),
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async ({ ctx }) =>
            prisma.group.findMany({
                orderBy: {
                    id: 'asc'
                },
                where: {
                    admins: {
                        some: {
                            adminId: Number(ctx.userId)
                        }
                    }
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            email: true,
                            username: true,
                            password: false
                        }
                    },
                    assignments: {
                        select: {
                            id: true
                        }
                    }
                }
            })
        ),
    get: t.procedure
        .use(adminAuth)
        .input(z.number())
        .query(async ({ input }) => {
            const groups = await prisma.group.findUnique({
                where: {
                    id: input
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            surname: true,
                            email: true,
                            submissions: {
                                include: {
                                    assignment: {
                                        select: {
                                            id: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    assignments: {
                        include: {
                            template: {
                                select: {
                                    id: true,
                                    title: true
                                }
                            },
                            submissions: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            surname: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            return {
                ...groups
            };
        })
});
