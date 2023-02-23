/* export interface QuestionContent {
    description?: string;
    codeBlocks?: string[];
    images?: string[];
    answers: string[];
};

export interface Question {
    title: string;
    content: QuestionContent;
} */

export interface Question {
    title: string;
    description?: string;
    answers: string[];
    correctAnswer: string;
}