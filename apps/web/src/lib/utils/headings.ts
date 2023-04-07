import type { Heading } from '@testy/database';

// Returns an array of row between questions where each row is either a heading or null (if there is no heading)
export const getInBetweenQuestionRows = (
    questions: { headingId: number | null }[],
    headings: Heading[]
): Array<Heading | null> => {
    const rows: Array<Heading | null> = new Array(questions.length); // rows between questions
    for (let i = 0; i < rows.length; i++) {
        const question = questions[i];
        const relatedHeading = headings.find((h) => h.id === question.headingId);

        // if the heading is already in the rows, skip it (we don't want same headings on the test page)
        if (relatedHeading && !rows.find((h) => h?.id === relatedHeading.id)) {
            const headingQuestions = questions // Find heading's questions so we know how to label it 
                .map((q, i) => ({ ...q, index: i })) // TODO: do we want to get heading's questions directly from heading???
                .filter((q) => q.headingId === relatedHeading.id);
            const min = Math.min(...headingQuestions.map((q) => q.index)) + 1; // 1 offset because questions labels start at 1
            const max = Math.max(...headingQuestions.map((q) => q.index)) + 1; // 1 offset because questions labels start at 1
            rows[i] = {
                ...relatedHeading,
                title: `VÝCHOZÍ TEXT K ${
                    headingQuestions.length == 1 ? 'ÚLOZE ' + min : 'ÚLOHÁM ' + min + ' - ' + max
                }`
            };
        }
    }
    return rows;
};
