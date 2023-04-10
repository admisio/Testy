import prisma from '../../prisma';
import type { TemplateFull, TemplateType } from '../../model/Template';

export const createTest = async (templateData: TemplateType): Promise<void> => {
    const {
        title,
        type,
        headings: headingsRaw,
        questions: questionsRaw,
        timeLimit,
        maxScore
    } = templateData;

    await prisma.$transaction(async (tx) => {
        // Create template
        const template = await tx.template.create({
            data: {
                title,
                type,
                timeLimit,
                maxScore
            }
        });

        // Create questions and connect to template
        const questions = [];
        for (const q of questionsRaw) {
            const dbQ = await tx.question.create({
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

        // Create headings, connect with questions and connect to template
        for (const heading of headingsRaw) {
            await tx.heading.create({
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
    });
};
