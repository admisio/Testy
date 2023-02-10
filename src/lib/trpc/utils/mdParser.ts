import { marked } from 'marked';
import { load } from 'cheerio';
import type { TestTemplateType } from '../model/TestTemplate';
import type { Question } from '../model/Question';

const OL_REGEX = /<ol(\sstart="[0-9]+")?/g;

const parseQuestion = (questionHTML: string): Question => {
    const document = load(questionHTML);
    const title = document('ol > li').html() ?? '';
    document('pre').last().addClass('answers');
    const answersRaw = document('pre > code').last();
    const answers = answersRaw
        .text()
        .split(/[a-d]\)/)
        .filter((a) => a.length > 0);
    console.log('answers:', answers);

    // const description = document('ol').nextUntil('.answers').html();
    // select code block with 'pre' and 'code' and keep <pre><code> tags in outputted string between title and last code block
    const description = document('ol').nextUntil('.answers').find('pre > code').parent().html();



    console.log('description:', description);

    return { title, description: description ?? undefined, answers, correctAnswer: 0  }
};

export const parseMd = async (md: string): Promise<TestTemplateType> => {
    const html = marked.parse(md);
    const document = load(html);
    const title = document('h1').text();
    const lines = html.split('\n');
    const olIndexes = lines
        .map((line, i) => (line.match(OL_REGEX) ? i : null))
        .filter((i) => i !== null);
    const questions = olIndexes.map((index, i) => {
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
    }).filter((q) => q !== null) as Array<Question>;

    return { title, questions };
};
