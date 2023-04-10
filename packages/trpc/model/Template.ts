import type { Template, Question as QuestionPrisma } from '@testy/database';
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
    type: 'G' | 'IT' | 'KB';
    headings: HeadingType[];
    questions: Question[];
    timeLimit: number;
    maxScore: number;
}
