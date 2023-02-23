import type { Template, Question as QuestionPrisma } from 'database';
import type { Question } from './Question';

export type TemplateFull = Template & { questions: QuestionPrisma[] };
/* export interface Template {
    id: number;
    title: string;
    questions: Question[];
} */
export interface HeadingType {
    title: string;
    description: string;
    questionRange: [number, number];
}

export interface TemplateType {
    title: string;
    headings: HeadingType[];
    questions: Question[];
    timeLimit: number;
    maxScore: number;
}
