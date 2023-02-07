import type { Question } from '../model/Question';
import type { TestTemplateType } from '../model/TestTemplate';

const TEST_TITLE_REGEX = /^# .+/gm;
const QUESTION_TITLE_REGEX = /^[0-9]+\.\s.+$/gm;
const DESCRIPTION_REGEX = /^```\n.+\n```$/gm;
// const ANSWER_REGEX = /^```\na\)\s.+\nb\)\s.+\nc\)\s.+\nd\)\s.+\n```$/gm;
const ANSWER_REGEX = /^```\r?\n?a\).+\r?\n?b\).+\r?\n?c\).+\r?\n?d\).+\r?\n?```$/gm;
// const QUESTION_BLOCK_REGEX = /([0-9]+\.\s.+)(```(.\n)+```)?\n\n(```\na\)\s.+\nb\)\s.+\nc\)\s.+\nd\)\s.+\n```)/;

const parseQuestion = (question: string): Question => {
    console.log(question.match(ANSWER_REGEX));
    const title = question.match(QUESTION_TITLE_REGEX)?.[0].replace(/^[0-9]+\.\s/, '') || '';
    const description = question
        .match(DESCRIPTION_REGEX)?.[0]
        .replace(/^```\n/, '')
        .replace(/\n```$/, '');
    console.log(question);
    const answers =
        question
            .match(ANSWER_REGEX)?.[0]
            .replaceAll('```', '')
            .split('\n')
            .map((answer) => answer.replace(/^[a-d]\)\s/, '').replaceAll('\r', ''))
            .filter((answer) => answer.length > 0) || [];

    return { title, content: { description, answers } };
};

export const parseMd = async (md: string): Promise<TestTemplateType> => {
    console.log('parsing');
    const title = md.match(TEST_TITLE_REGEX)?.[0].replace(/^# /, '') || '';
    const titles = md.match(QUESTION_TITLE_REGEX);
    console.log(titles);
    const indexes = titles?.map((title) => md.indexOf(title));
    console.log('indexes:', indexes);

    const questions =
        indexes?.map((index, i) => {
            const nextIndex = indexes[i + 1];
            const question = md.slice(index, nextIndex);
            return parseQuestion(question);
        }) || [];

    // const questions: Array<Question> = md.match(QUESTION_BLOCK_REGEX)?.map(parseQuestion) || [];

    // console.log(md.match(QUESTION_BLOCK_REGEX));

    return { title, questions };
};
