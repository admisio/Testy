import prisma from '$lib/prisma';
import type { TestTemplateFull, TestTemplateType } from '../model/TestTemplate';

export const createTest = async (test: TestTemplateType): Promise<TestTemplateFull> => {
    const { title, questions } = test;
    const testTemplate = await prisma.testTemplate.create({
        data: {
            title,
            questions: {
                createMany: {
                    data: questions.map((question) => ({
                        title: question.title,
                        description: question.description,
                        answers: question.answers,
                        correctAnswer: question.correctAnswer
                    }))
                }
            }
        },
        include: {
            questions: true
        }
    });

    return testTemplate;
};
