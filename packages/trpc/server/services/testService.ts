import prisma from '../../prisma';
import type { TemplateType } from '../../model/Template';
import { Answer, Assignment, Question, Submission, User } from '@testy/database';
import * as fs from 'fs';
import * as XLXS from 'xlsx';

export const createTest = async (templateData: TemplateType): Promise<void> => {
    const {
        title,
        type,
        headings: headingsRaw,
        questions: questionsRaw,
        timeLimit,
        maxScore
    } = templateData;

    await prisma.$transaction(async (tx) => {
        // Create template
        const template = await tx.template.create({
            data: {
                title,
                type,
                timeLimit,
                maxScore
            }
        });

        // Create questions and connect to template
        const questions: Question[] = [];
        for (const q of questionsRaw) {
            const dbQ = await tx.question.create({
                data: {
                    title: q.title,
                    description: q.description,
                    correctAnswer: q.correctAnswer,
                    templateAnswers: {
                        set: q.answers
                    },
                    template: {
                        connect: {
                            id: template.id
                        }
                    }
                }
            });
            questions.push(dbQ);
        }

        // Create headings, connect with questions and connect to template
        for (const heading of headingsRaw) {
            await tx.heading.create({
                data: {
                    title: heading.title,
                    description: heading.description,
                    test: {
                        connect: {
                            id: template.id
                        }
                    },
                    questions: {
                        connect: questions
                            .filter(
                                (_, i) =>
                                    i + 1 >= heading.questionRange[0] &&
                                    i + 1 <= heading.questionRange[1]
                            )
                            .map((q) => ({ id: q.id }))
                    }
                }
            });
        }
    });
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getUserData = ([user, assignments, submissions, answers]: [
    User,
    Assignment[],
    Submission[],
    Answer[]
]): {
    submission: Submission;
    answers: Answer[];
} | null => {
    const assignment = assignments.find((a) => a.groupId === user.groupId && a.started);
    if (!assignment) return null;
    const submission = submissions.find(
        (s) => s.assignmentId === assignment.id && s.userId === user.id // TODO maybe not working
    );
    if (!submission) return null;
    const filteredAnswers = answers.filter(
        (a) => a.userId == user.id && a.assignmentId === assignment.id
    );
    return { submission, answers: filteredAnswers };
};

const getAnswersRow = (answers: Answer[]): { [key: string]: number } => {
    return answers
        .map((a) => {
            return {
                [`Q${a.questionId}`]: a.index
            };
        })
        .reduce((o, a, _) => {
            return {
                ...o,
                ...a
            };
        });
};

type Record = { cell: string; templateType: string };
class ResultCellMap extends Map<string, Record[]> {
    addTemplate(key: string, d: Record): void {
        const item = this.get(key);
        super.set(key, item?.concat(d) ?? [d]);
    }
}

export const exportXlsx = async (): Promise<string> => {
    const workbook = XLXS.utils.book_new();
    XLXS.set_fs(fs);

    const templates = await prisma.template.findMany({
        include: {
            questions: true
        }
    });
    const assignmentsDb = await prisma.assignment.findMany({});
    const submissionsDb = await prisma.submission.findMany({});
    const answersDb = await prisma.answer.findMany({});
    const usersDb = await prisma.user.findMany({});
    const resultCell = new ResultCellMap();

    templates.forEach((template, i) => {
        const headers = [
            'username',
            'group',
            'original_score',
            'original_max_score',
            'score',
            'max_score',
            'percent',
            template.questions.map((q) => `Q${q.id}`)
        ].flat();
        const scoreCol = ALPHABET[headers.indexOf('score')];

        const templateAssignments = assignmentsDb.filter((a) => a.testId === template.id);
        const groupUsers = usersDb.filter((u) =>
            templateAssignments.some((a) => a.groupId === u.groupId)
        );
        const rows = groupUsers.map((user) => {
            const d = getUserData([user, templateAssignments, submissionsDb, answersDb]);
            if (!d) return { username: user.username, group: user.groupId };
            const { submission, answers } = d;

            const answersRow = getAnswersRow(answers);
            return {
                username: user.username,
                group: user.groupId,
                ...answersRow,
                original_score: submission.evaluation,
                original_max_score: template.maxScore
            };
        });
        // Add correct answers row
        rows.unshift({
            username: template.title,
            group: 0,
            ...getCorrectAnswersRow(template.questions),
            original_max_score: template.maxScore
        });

        const sheet = XLXS.utils.json_to_sheet(rows, { header: headers });
        const sheetName = `test${i}`;

        const percentCol = ALPHABET[headers.indexOf('percent')];
        const maxScoreCol = ALPHABET[headers.indexOf('max_score')];
        const maxScoreCell = `${maxScoreCol}2`;
        XLXS.utils.sheet_set_array_formula(
            sheet,
            maxScoreCell,
            getCountblankXlsxFnString(headers, 2)
        );
        XLXS.utils.sheet_set_array_formula(
            sheet,
            `${ALPHABET[headers.indexOf('percent')]}2`,
            getPercentXlsxFnString(
                `${ALPHABET[headers.indexOf('score')]}2`,
                `${ALPHABET[headers.indexOf('max_score')]}2`
            )
        );
        for (let R = 3; R < rows.length + 2; R++) {
            // read username cell
            const username = sheet[`${ALPHABET[0]}${R}`].v;
            const scoreCell = `${scoreCol}${R}`;
            resultCell.addTemplate(username, {
                cell: `${sheetName}!${scoreCell}`,
                templateType: template.type
            });
            XLXS.utils.sheet_set_array_formula(sheet, scoreCell, getSumXlsxFnString(headers, R, 2));
            XLXS.utils.sheet_set_array_formula(sheet, `${maxScoreCol}${R}`, maxScoreCell);
            XLXS.utils.sheet_set_array_formula(
                sheet,
                `${percentCol}${R}`,
                getPercentXlsxFnString(scoreCell, maxScoreCell)
            );
        }

        headers
            .map((h, i) => {
                return {
                    s: h,
                    i
                };
            })
            .filter((h) => h.s.startsWith('Q'))
            .forEach(({ s, i }) => {
                const question = template.questions.find((q) => q.id === Number(s.slice(1)));
                if (question) {
                    sheet[`${ALPHABET[i]}1`].v += '(' + question.title.slice(0, 120) + ')';
                }
            });
        sheet['!cols'] = [{ wch: 50 }];

        XLXS.utils.book_append_sheet(workbook, sheet, sheetName);
    });

    const userSheet = getUserSheet(usersDb, resultCell);
    XLXS.utils.book_append_sheet(workbook, userSheet, 'users');

    return XLXS.write(workbook, { bookType: 'xlsx', type: 'base64' });
};

const getUserSheet = (users: User[], resultCell: ResultCellMap): XLXS.WorkSheet => {
    const headers = [
        'username',
        'group',
        'score_g',
        'max_score_g',
        'score_it',
        'max_score_it',
        'score_kb',
        'max_score_kb'
    ];
    const sheet = XLXS.utils.json_to_sheet(
        users.map((u) => {
            return { username: u.username, group: u.groupId };
        }),
        { header: headers }
    );

    for (let R = 2; R < users.length + 2; R++) {
        const username = sheet[`A${R}`].v;

        const userTemplates = resultCell.get(username);
        [
            userTemplates?.find((t) => t.templateType === 'G')?.cell,
            userTemplates?.find((t) => t.templateType === 'IT')?.cell,
            userTemplates?.find((t) => t.templateType === 'KB')?.cell
        ].forEach((c, i) => {
            if (c) {
                const C = ALPHABET[i * 2 + 2];
                XLXS.utils.sheet_set_array_formula(sheet, `${C}${R}`, `${c}`);
                XLXS.utils.sheet_set_array_formula(
                    sheet,
                    `${ALPHABET[i * 2 + 3]}${R}`,
                    `${c.split('!')[0]}!F2` // TODO: not fixed cell
                );
            }
        });
    }
    return sheet;
};

const getSumXlsxFnString = (headers: string[], row: number, correctRow: number): string => {
    const colRange = headers
        .map((h, i) => {
            return {
                s: h,
                i
            };
        })
        .filter((h) => h.s.startsWith('Q'))
        .map(({ i }) => i);

    const [colMin, colMax] = [colRange[0], colRange[colRange.length - 1]].map((c) => ALPHABET[c]);
    const correctRange = `${colMin}$${correctRow}:${colMax}$${correctRow}`;
    const range = `${colMin}${row}:${colMax}${row}`;
    const sumFn = `SUM(IF(${range}="",0,IF(${range}=${correctRange},1,0)))`;
    return sumFn;
};

const getCountblankXlsxFnString = (headers: string[], row: number): string => {
    const sumFn = headers
        .map((h, i) => {
            return {
                s: h,
                i
            };
        })
        .filter((h) => h.s.startsWith('Q'))
        .map((h) => {
            const col = ALPHABET[h.i];
            const cell = `${col}${row}`;
            return `IF(ISBLANK(${cell}),0,1)`;
        })
        .join('+');
    return sumFn;
};

const getPercentXlsxFnString = (cellA: string, cellB: string): string => {
    return `${cellA}/${cellB}`;
};

const getCorrectAnswersRow = (questions: Question[]): { [x: string]: string | number } => {
    const row = questions
        .map((q) => {
            return {
                [`Q${q.id}`]: q.templateAnswers.indexOf(q.correctAnswer)
            };
        })
        .reduce((o, a, _) => {
            return {
                ...o,
                ...a
            };
        });
    return row;
};
