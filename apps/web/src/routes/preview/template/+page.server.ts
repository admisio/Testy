import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseMd } from '$lib/utils/mdParser';

export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const data = await request.formData();

            const mdFile = data.get('file') as Blob;

            const templateData = await parseMd(await mdFile.text(), Number(20));

            // TODO: DRY with prisma createTest, use only one function

            const { title, headings, questions } = templateData;

            const template = {
                title,
                questions: questions.map((question) => ({
                    title: question.title,
                    description: question.description || null,
                    templateAnswers: question.answers,
                    correctAnswer: question.correctAnswer
                })),
                headings: headings.map((heading) => ({
                    title: heading.title,
                    description: heading.description,
                    questionRangeStart: heading.questionRange[0],
                    questionRangeEnd: heading.questionRange[1]
                })),
                maxScore: templateData.maxScore
            };

            return { success: true, template };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Parsing failed', incorrect: true });
        }
    }
};
