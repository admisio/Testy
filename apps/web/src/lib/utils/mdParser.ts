import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

import { load } from 'cheerio';
import type { HeadingType, TemplateType, Question } from '@testy/trpc';

const OL_REGEX = /<ol(\sstart="[0-9]+")?/g;

const parseQuestion = (questionHTML: string): Question => {
    const document = load(questionHTML);
    const title = document('ol > li').html() ?? '';
    document('pre').last().addClass('answers');
    const answersHTML = document('pre > code').last();
    const answersRaw = answersHTML
        .text()
        .split(/[a-e]\)/)
        .filter((a) => a.length > 0)
        .map((a) => a.trim());
    // find correct answer (starts with * ends with *)
    const correctAnswerList = answersRaw
        .map((a) => (a.match(/\*(.|\n)+\*/) ? a : null))
        .filter((i) => i !== null);
    if (correctAnswerList.length > 1 || correctAnswerList.length === 0 || !correctAnswerList[0])
        throw new Error(
            JSON.stringify({ code: 'PARSE_ERROR', message: 'Invalid correct answers count' })
        );

    const correctAnswer = correctAnswerList[0].replaceAll('*', '');
    const answersSanitized = answersRaw.map((a) => a.replaceAll('*', ''));

    // select all md text between title and last code block
    const description = document('ol').nextUntil('.answers').toString();

    return {
        title,
        description: description ?? undefined,
        answers: answersSanitized,
        correctAnswer
    };
};

export const parseMd = async (md: string, timeLimit: number): Promise<TemplateType> => {
    marked.use(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code: string, lang: string) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        })
    );
    const html = marked.parse(md);
    console.log(html);
    const document = load(html);
    const h1 = document('h1').text();
    const lines = html.split('\n');
    const olIndexes = lines
        .map((line, i) => (line.match(OL_REGEX) ? i : null))
        .filter((i) => i !== null);

    const questions = olIndexes
        .map((index, i) => {
            if (!index) return null;
            const nextIndex = olIndexes[i + 1];
            if (i === olIndexes.length - 1) {
                const question = lines.slice(index).join('\n');
                return parseQuestion(question);
            } else if (nextIndex) {
                const question = lines.slice(index, nextIndex).join('\n');
                return parseQuestion(question);
            } else {
                return null;
            }
        })
        .filter((q) => q !== null) as Array<Question>;

    const headingsDescriptions = document('h3')
        .map((i, el) => document(el).html())
        .toArray();

    const headings = document('h2')
        .map((i, el) => ({
            title: document(el)
                .html()
                ?.replace(/\[([0-9]+)-([0-9]+)\]/, ''),
            description: headingsDescriptions[i],
            // find question range - e.g. ## Heading 1 [1-5] for questions 1-5
            questionRange: document(el)
                .text()
                .match(/\[([0-9]+)-([0-9]+)\]/)
                ?.slice(1, 3)
                .map(Number)
        }))
        .filter((i) => i !== null)
        .toArray() as Array<HeadingType>;

    const type = h1.split('|')[1].trim() as TemplateType['type'];
    const title = `${h1} (${timeLimit} min)`;
    return { title, type, headings, questions, timeLimit, maxScore: questions.length };
};
