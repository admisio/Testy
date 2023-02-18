import prisma from '$lib/prisma';
import type { TestTemplateFull, TestTemplateType } from '../model/TestTemplate';

export const createTest = async (test: TestTemplateType): Promise<TestTemplateFull> => {
    const { title, headings, questions } = test;
    console.log('should create');
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
            },
            headings: {
                createMany: {
                    data: headings.map((heading) => ({
                        title: heading.title,
                        description: heading.description,
                        questionRangeStart: heading.questionRange[0],
                        questionRangeEnd: heading.questionRange[1]
                    }))
                }
            },
            timeLimit: test.timeLimit,
            maxScore: test.maxScore
            
        },
        include: {
            headings: true,
            questions: true
        }
    });
    return testTemplate;
};
