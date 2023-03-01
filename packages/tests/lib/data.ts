import { Question, Template } from '@prisma/client';
import { Admin, Group, User } from '@testy/database';
import prisma from '@testy/database/client';
import { router } from '@testy/trpc/server/router';
import bcrypt from 'bcrypt';

type UserType = {
    email: string;
    name: string;
    surname: string;
    username: string;
    password: string;
};

type GroupType = {
    name: string;
};

type AdminType = {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
};

type QuestionType = {
    title: string;
    description: string | null;
    templateAnswers: string[];
    correctAnswer: string;
}

type TemplateType = {
    title: string;
    timeLimit: number;
    maxScore: number;
};

const generateUsers = (data: {
    idStart: number;
    count: number;
}): Array<UserType> => {
    const users: Array<UserType> = [];
    for (let i = data.idStart; i < data.count; i++) {
        users.push({
            email: `mail${i}`,
            name: `name${i}`,
            surname: `surname${i}`,
            username: `username${i}`,
            password: `password${i}`
        });
    }
    return users;
};

const generateQuestions = (data: {
    idStart: number;
    count: number;
}): Array<QuestionType> => {
    const questions: Array<QuestionType> = [];
    for (let i = data.idStart; i < data.count; i++) {
        questions.push({
            title: `question${i}`,
            templateAnswers: ["answer1", "answer2", "answer3", "answer4"],
            correctAnswer: "answer1",
            description: "description"
        });
    }
    return questions;
};

export const GROUPS: Array<GroupType> = [
    {
        name: 'group 1'
    },
    {
        name: 'group 2'
    }
];

export const USERS: Array<UserType> = [
    generateUsers({ idStart: 1, count: 15 }),
    // generateUsers({ idStart: 16, count: 15 })
]
    .flat()
    .map((user) => {
        return {
            ...user,
            password: bcrypt.hashSync(user.password, 10)
        };
    });

export const QUESTIONS: Array<QuestionType> = [
    generateQuestions({ idStart: 1, count: 10 }),
    // generateQuestions({ idStart: 11, count: 15, templateId: 2 })
].flat();

export const ADMIN: AdminType = {
    name: 'admin',
    surname: 'admin',
    username: 'admin',
    email: 'admin',
    password: bcrypt.hashSync('admin', 10)
};

export const TEMPLATE: TemplateType = {
    title: 'template',
    timeLimit: 25,
    maxScore: 15
};

const TRPC_CALLER_TYPE = router.createCaller({userId: '1', role: 'admin'});

export const getTestData = async (): Promise<{
    GROUPS: Array<Group>;
    USERS: Array<User>;
    QUESTIONS: Array<Question>;
    ADMIN: Admin;
    TEMPLATE: Template;
    adminTrpc: typeof TRPC_CALLER_TYPE;
}> => {
    const groups = await prisma.group.findMany({});
    const users = await prisma.user.findMany({});
    const questions = await prisma.question.findMany({});
    const admin = await prisma.admin.findFirstOrThrow({});
    const template = await prisma.template.findFirstOrThrow({});
    const adminTrpc = router.createCaller({
        userId: admin.id.toString(),
        role: 'admin'
    });

    return {
        GROUPS: groups,
        USERS: users,
        QUESTIONS: questions,
        ADMIN: admin,
        TEMPLATE: template,
        adminTrpc
    };
};