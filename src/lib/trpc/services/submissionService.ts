import prisma from '$lib/prisma';
import type { AssignedTest } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const createSubmission = async (userId: number, assignedTest: AssignedTest): Promise<void> => {
    // evaluate each answer and calculate score
    const answers = await prisma.answer.findMany({
        where: {
            assignedTestId: assignedTest.id,
            userId: userId,
        }
    });
    const questions = await prisma.question.findMany({
        where: {
            testId: assignedTest.testId
        }
    });
    // match answers with questions
    const evaluatedAnswers = await Promise.all(
        answers.map(async (answer) => {
            const question = questions.find(
                (question) => question.id === answer.questionId
            );
            if (!question) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Question not found' });
            }
            const correct = question.correctAnswer === answer.value;
            const evaluation: number = correct ? 1 : 0;
            await prisma.answer.update({
                where: {
                    id: answer.id
                },
                data: {
                    evaluated: true,
                    evaluation: evaluation
                }
            });
            return evaluation;
        })
    );

    const score = evaluatedAnswers.reduce((a, b) => a + b, 0);

    await prisma.testSubmission.create({
        data: {
            user: {
                connect: {
                    id: userId,
                }
            },
            assignedTest: {
                connect: {
                    id: assignedTest.id
                }
            },
            submittedAt: new Date(),
            evaluation: score
        }
    });
}