import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseMd } from '$lib/utils/mdParser';
import type { Heading } from '@testy/database';

export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const data = await request.formData();

            const mdFile = data.get('file') as Blob;

            const templateData = await parseMd(await mdFile.text(), Number(20));

            // TODO: DRY with prisma createTest, use only one function

            const { title, headings: headingsRaw, questions } = templateData;

            const headings = headingsRaw.map((heading, i) => ({
                id: i,
                title: heading.title,
                description: heading.description,
                questionRange: heading.questionRange,
                testId: 0
            }));

            const template = {
                title,
                questions: questions.map((question, i) => ({
                    title: question.title,
                    description: question.description || null,
                    templateAnswers: question.answers,
                    correctAnswer: question.correctAnswer,
                    headingId: headings.find(
                        (h) => i + 1 >= h.questionRange[0] && i + 1 <= h.questionRange[1]
                    )?.id
                })),
                headings,
                maxScore: templateData.maxScore
            };

            return { success: true, template };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Parsing failed', incorrect: true });
        }
    }
};
