import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';
import { userAuth } from '../middleware/userAuth';
import { TRPCError } from '@trpc/server';
import { findUniqueWithSubmission } from '../query/user';
import { addMinutes } from 'date-fns';
import { createSubmission } from '../services/submissionService';
import { submitExpired } from '../services/assignedTestService';

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
            const template = await prisma.assignedTest.findUniqueOrThrow({
                where: {
                    id: input.assignedTestId
                },
                select: {
                    test: {
                        select: {
                            timeLimit: true
                        }
                    }
                }
            });
            const startTime = new Date();
            const endTime = addMinutes(startTime, template.test.timeLimit);
            await prisma.assignedTest.update({
                where: {
                    id: input.assignedTestId
                },
                data: {
                    started: true,
                    startTime,
                    endTime
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
                    },
                    submissions: {
                        select: {
                            testId: true
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
            const user = await findUniqueWithSubmission(Number(ctx.userId), input.assignedTestId);
            const assignedTest = await prisma.assignedTest.findUnique({
                where: {
                    id: input.assignedTestId
                },
                include: {
                    test: {
                        include: {
                            headings: true,
                            questions: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    answers: true,
                                    submittedAnswers: {
                                        where: {
                                            assignedTest: {
                                                id: input.assignedTestId
                                            },
                                            user: {
                                                id: user.id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    submissions: {}
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
            return { assignedTest, user };
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
            const user = await findUniqueWithSubmission(Number(ctx.userId), input.assignedTestId);
            const assignedTest = await prisma.assignedTest.findUnique({
                where: {
                    id: input.assignedTestId
                }
            });
            if (user.testSubmissions.length > 0) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test already submitted' });
            }
            if (!assignedTest) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Test not found' });
            }
            if (assignedTest?.groupId !== user?.groupId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Test was not assigned to your group'
                });
            }
            if (
                !assignedTest?.started ||
                !assignedTest.endTime ||
                new Date() > assignedTest.endTime
            ) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test has not started yet' });
            }
            await prisma.answer.upsert({
                where: {
                    user_question_test: {
                        userId: user.id,
                        questionId: input.questionId,
                        assignedTestId: input.assignedTestId
                    }
                },
                update: {
                    value: input.answer
                },
                create: {
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
                    assignedTest: {
                        connect: {
                            id: input.assignedTestId
                        }
                    },
                    value: input.answer
                }
            });
        }),
    submitAllExpired: t.procedure.use(adminAuth).query(async ({ ctx }) => {
        await submitExpired();
    }),
    submitTest: t.procedure
        .use(userAuth)
        .input(
            z.object({
                assignedTestId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await findUniqueWithSubmission(Number(ctx.userId), input.assignedTestId);
            const assignedTest = await prisma.assignedTest.findUniqueOrThrow({
                where: {
                    id: input.assignedTestId
                }
            });

            if (!assignedTest?.started) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test has not started yet' });
            }

            if (user.testSubmissions.length > 0) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test already submitted' });
            }

            if (assignedTest.groupId !== user.groupId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Test was not assigned to your group'
                });
            }

            await createSubmission(user.id, assignedTest);
        })
});
