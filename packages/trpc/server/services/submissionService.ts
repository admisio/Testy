import prisma from '../../prisma';
import type { Assignment } from '@testy/database';
import logger from '@testy/logging';
import { TRPCError } from '@trpc/server';

export const createSubmission = async (userId: number, assignment: Assignment): Promise<void> => {
    // evaluate each answer and calculate score
    await prisma.$transaction(async (tx) => {
        const answers = await tx.answer.findMany({
            where: {
                assignmentId: assignment.id,
                userId: userId
            }
        });

        const questions = await tx.question.findMany({
            where: {
                testId: assignment.testId
            }
        });

        const evaluatedAnswers = await Promise.all(
            answers.map(async (answer) => {
                const question = questions.find((question) => question.id === answer.questionId);
                if (!question) {
                    logger.error(`USER (${userId}): answer ${answer.id} with index ${answer.index} has no question ${answer.questionId}!`);
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Question not found' });
                }
                const correct = question.correctAnswer === answer.value;
                const evaluation: number = correct ? 1 : 0;
                await tx.answer.update({
                    where: {
                        id: answer.id
                    },
                    data: {
                        evaluated: true,
                        evaluation: evaluation
                    }
                });
                logger.info(`USER (${userId}): answer ${answer.id} with index ${answer.index} evaluated as ${evaluation} (correct answer: ${question.correctAnswer}, user answer: ${answer.value})`)
                return evaluation;
            })
        );

        const score = evaluatedAnswers.reduce((a, b) => a + b, 0);

        await tx.submission.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                assignment: {
                    connect: {
                        id: assignment.id
                    }
                },
                evaluation: score
            }
        });

        logger.info(
            `USER (${userId}): submitted assignment ${assignment.id} with score ${score} (${questions.length} questions, ${answers.length} answers, ${evaluatedAnswers.length} evaluated answers})`
        );
    });
};
