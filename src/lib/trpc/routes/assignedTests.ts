import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';
import { userAuth } from '../middleware/userAuth';
import { TRPCError } from '@trpc/server';
import type { Answer, AssignedTest, Prisma, TestTemplate } from '@prisma/client';
import type { QuestionContent } from '../model/Question';

export const assignedTests = t.router({
    assignToGroup: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                templateId: z.number(),
                groupId: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const assignedTest = await prisma.assignedTest.create({
                data: {
                    test: {
                        connect: {
                            id: input.templateId
                        }
                    },
                    group: {
                        connect: {
                            id: input.groupId
                        }
                    },
                    started: false
                }
            });
            await prisma.group.update({
                where: {
                    id: input.groupId
                },
                data: {
                    assignedTests: {
                        connect: {
                            id: assignedTest.id
                        }
                    }
                }
            });
        }),
    start: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                assignedTestId: z.number()
            })
        )
        .mutation(async ({ input }) => {
            await prisma.assignedTest.update({
                where: {
                    id: input.assignedTestId
                },
                data: {
                    started: true,
                    startTime: new Date(),
                    endTime: new Date()
                }
            });
        }),
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async () => prisma.assignedTest.findMany()),

    userList: t.procedure
        .use(userAuth)
        .input(z.string().optional())
        .query(async ({ ctx }) => {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    id: Number(ctx.userId)
                }
            });
            const assignedTests = await prisma.assignedTest.findMany({
                where: {
                    group: {
                        users: {
                            some: {
                                id: user.id
                            }
                        }
                    }
                },
                include: {
                    test: {
                        select: {
                            title: true
                        }
                    }
                }
            });
            return assignedTests;
        }),
    // user routes
    get: t.procedure
        .use(userAuth)
        .input(
            z.object({
                assignedTestId: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    id: Number(ctx.userId)
                }
            });
            const assignedTest = await prisma.assignedTest.findUnique({
                where: {
                    id: input.assignedTestId
                },
                include: {
                    test: {
                        include: {
                            questions: {
                                select: {
                                    id: true,
                                    title: true,
                                    content: true,
                                    submittedAnswers: {
                                        where: {
                                            user: {
                                                id: user.id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (!assignedTest) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Test not found' });
            }
            if (assignedTest?.groupId !== user?.groupId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Test was not assigned to your group'
                });
            }
            if (!assignedTest?.started) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test has not started yet' });
            }
            return assignedTest as unknown as AssignedTest & {
                test: TestTemplate & {
                    questions: {
                        id: number;
                        title: string;
                        content: QuestionContent;
                        submittedAnswers: Answer[];
                    }[];
                };
            };
        }),
    submitAnswer: t.procedure
        .use(userAuth)
        .input(
            z.object({
                assignedTestId: z.number(),
                questionId: z.number(),
                answer: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(ctx.userId)
                }
            });
            const assignedTest = await prisma.assignedTest.findUnique({
                where: {
                    id: input.assignedTestId
                }
            });
            if (!assignedTest) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Test not found' });
            }
            if (assignedTest?.groupId !== user?.groupId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Test was not assigned to your group'
                });
            }
            if (!assignedTest?.started) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test has not started yet' });
            }
            const foundAnswer = await prisma.answer.findFirst({
                where: {
                    questionId: input.questionId,
                    userId: user.id
                }
            });
            if (foundAnswer) {
                return prisma.answer.update({
                    where: {
                        id: foundAnswer.id
                    },
                    data: {
                        value: input.answer
                    }
                });
            } else {
                return await prisma.answer.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id
                            }
                        },
                        question: {
                            connect: {
                                id: input.questionId
                            }
                        },
                        value: input.answer
                    }
                });
            }
        })
});
