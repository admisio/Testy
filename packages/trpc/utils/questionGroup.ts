export const groupQuestionsByHeadings = (
    questions: { headingId: number | null }[],
    headings: { id: number }[]
): { headingId: number | null }[][] => {
    return headings
        .map((h) => questions.filter((q) => q.headingId === h.id) ?? [])
        .concat(questions.filter((q) => !q.headingId));
};
