import prisma from '../../prisma';
import type { TemplateFull, TemplateType } from '../../model/Template';

export const createTest = async (templateData: TemplateType): Promise<void> => {
    const { title, headings: headingsRaw, questions: questionsRaw } = templateData;

    // TODO: prisma transaction

    // Create template
    const template = await prisma.template.create({
        data: {
            title,
            timeLimit: templateData.timeLimit,
            maxScore: templateData.maxScore
        }
    });

    // Create questions and connect to template
    const questions = [];
    for (const q of questionsRaw) {
        const dbQ = await prisma.question.create({
            data: {
                title: q.title,
                description: q.description,
                correctAnswer: q.correctAnswer,
                templateAnswers: {
                    set: q.answers
                },
                template: {
                    connect: {
                        id: template.id
                    }
                }
            }
        });
        questions.push(dbQ);
    }

    console.log(questions);

    // Create headings, connect with questions and connect to template
    for (const heading of headingsRaw) {
        await prisma.heading.create({
            data: {
                title: heading.title,
                description: heading.description,
                test: {
                    connect: {
                        id: template.id
                    }
                },
                questions: {
                    connect: questions
                        .filter(
                            (_, i) =>
                                i + 1 >= heading.questionRange[0] &&
                                i + 1 <= heading.questionRange[1]
                        )
                        .map((q) => ({ id: q.id }))
                }
            }
        });
    }
};
