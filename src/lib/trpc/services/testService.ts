import prisma from '$lib/prisma';
import type { TemplateFull, TemplateType } from '../model/Template';

export const createTest = async (templateData: TemplateType): Promise<TemplateFull> => {
    const { title, headings, questions } = templateData;
    console.log('should create');
    const template = await prisma.template.create({
        data: {
            title,
            questions: {
                createMany: {
                    data: questions.map((question) => ({
                        title: question.title,
                        description: question.description,
                        templateAnswers: question.answers,
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
            timeLimit: templateData.timeLimit,
            maxScore: templateData.maxScore
            
        },
        include: {
            headings: true,
            questions: true
        }
    });
    return template;
};
