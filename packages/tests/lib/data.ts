import { Question, Template } from '@prisma/client';
import bcrypt from 'bcrypt';

type UserType = {
    id: number;
    email: string;
    name: string;
    surname: string;
    username: string;
    password: string;
    groupId: number;
};

type GroupType = {
    id: number;
    name: string;
};

type AdminType = {
    id: number;
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
};

/* type QuestionType = {
    id: number;
    text: string;
    templateId: number;
    correctAnswer: string;
}; */

type TemplateType = {
    id: number;
    name: string;
    timeLimit: number;
};

const generateUsers = (data: {
    idStart: number;
    count: number;
    groupId: number;
}): Array<UserType> => {
    const users: Array<UserType> = [];
    for (let i = data.idStart; i < data.count; i++) {
        users.push({
            id: i,
            email: `mail${i}`,
            name: `name${i}`,
            surname: `surname${i}`,
            username: `username${i}`,
            password: `password${i}`,
            groupId: data.groupId
        });
    }
    return users;
};

const generateQuestions = (data: {
    idStart: number;
    count: number;
    templateId: number;
}): Array<Question> => {
    const questions: Array<Question> = [];
    for (let i = data.idStart; i < data.count; i++) {
        questions.push({
            id: i,
            title: `question${i}`,
            templateAnswers: ["answer1", "answer2", "answer3", "answer4"],
            correctAnswer: "answer1",
            description: "description",
            testId: data.templateId
        });
    }
    return questions;
};

export const GROUPS: Array<GroupType> = [
    {
        id: 1,
        name: 'group 1'
    },
    {
        id: 2,
        name: 'group 2'
    }
];

export const USERS: Array<UserType> = [
    generateUsers({ idStart: 1, count: 15, groupId: 1 }),
    generateUsers({ idStart: 16, count: 15, groupId: 2 })
]
    .flat()
    .map((user) => {
        return {
            ...user,
            password: bcrypt.hashSync(user.password, 10)
        };
    });

export const QUESTIONS: Array<Question> = [
    generateQuestions({ idStart: 1, count: 10, templateId: 1 }),
    // generateQuestions({ idStart: 11, count: 15, templateId: 2 })
].flat();

export const ADMIN: AdminType = {
    id: 1,
    name: 'admin',
    surname: 'admin',
    username: 'admin',
    email: 'admin',
    password: bcrypt.hashSync('admin', 10)
};

export const TEMPLATE: Template = {
    id: 1,
    title: 'template',
    timeLimit: 25,
    maxScore: 15
};
