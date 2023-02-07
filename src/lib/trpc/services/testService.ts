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
                        content: {
                            description: question.content.description,
                            codeBlocks: question.content.codeBlocks,
                            images: question.content.images,
                            answers: question.content.answers
                        },
                        correctAnswer: 'neznam'
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
