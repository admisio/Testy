import type { TestTemplate, Question as QuestionPrisma } from "@prisma/client";
import type { Question } from "./Question";

export type TestTemplateFull = TestTemplate & {questions: QuestionPrisma[]};
/* export interface TestTemplate {
    id: number;
    title: string;
    questions: Question[];
} */
export interface HeadingType {
    title: string;
    description: string;
    questionRange: [number, number];
}

export interface TestTemplateType {
    title: string;
    headings: HeadingType[];
    questions: Question[];
    timeLimit: number;
    maxScore: number;
}