import { expect, test, beforeEach, afterEach } from 'vitest';
import { addMinutes } from 'date-fns';
import { getTestData } from '../lib/data';
import { router } from '@testy/trpc/server/router';
import { resetDb } from '../reset';

beforeEach(async () => {
    await resetDb();
})

afterEach(async () => {
    await resetDb();
})


test('should assign test template to group', async () => {
    const {adminTrpc, GROUPS, TEMPLATE} = await getTestData();
    await adminTrpc.assignments.assignToGroup({
        templateId: TEMPLATE.id,
        groupId: GROUPS[0].id
    });
    const assignment = (await adminTrpc.assignments.list())[0];
    expect(assignment.groupId).toBe(GROUPS[0].id);
    expect(assignment.started).toBe(false);
});

test('should start assignment with correct endTime', async () => {
    const {adminTrpc, GROUPS, TEMPLATE} = await getTestData();
    await adminTrpc.assignments.assignToGroup({
        templateId: TEMPLATE.id,
        groupId: GROUPS[0].id
    });
    const assignments = await adminTrpc.assignments.list();
    expect(assignments).toHaveLength(1);
    expect(assignments[0].started).toBe(false);
    await adminTrpc.assignments.start({
        assignmentId: assignments[0].id
    });
    const startedAssignment = (await adminTrpc.assignments.list())[0];
    expect(startedAssignment.started).toBe(true);
    if (!startedAssignment.startTime) throw new Error('Assignment startTime is null');
    expect(startedAssignment.endTime).toEqual(addMinutes(startedAssignment.startTime, 25));
});

test('should submit answers and get correct results', async () => {
    const {adminTrpc, GROUPS, TEMPLATE, USERS, QUESTIONS} = await getTestData();
    await adminTrpc.assignments.assignToGroup({
        templateId: TEMPLATE.id,
        groupId: GROUPS[0].id
    });
    const assignment = (await adminTrpc.assignments.list())[0];
    await adminTrpc.assignments.start({
        assignmentId: assignment.id
    });
    const trpc = router.createCaller({ userId: USERS[0].id.toString(), role: 'user' });
    for (let i = 0; i < QUESTIONS.length; i++) {
        const question = QUESTIONS[i];
        await trpc.assignments.submitAnswer({
            assignmentId: assignment.id,
            questionId: question.id,
            answer: 'answer' + (i % 4) // predictable result
        });
    }
    const res = await trpc.assignments.get({ assignmentId: assignment.id });
    res.assignment.template.questions.forEach((question, i) => {
        expect(question.submittedAnswers[0].value).toEqual('answer' + (i % 4));
    });

    await trpc.assignments.submittemplate({ assignmentId: assignment.id });

    const submission = await trpc.submissions.get({ assignmentId: assignment.id });
    expect(submission.evaluation).toEqual(Math.floor(QUESTIONS.length / 4));
    expect(submission.assignment.submittedAnswers).toHaveLength(QUESTIONS.length);
    submission.assignment.submittedAnswers.forEach((answer, i) => {
        expect(answer.evaluation).toEqual(QUESTIONS.find((q) => q.id === answer.questionId)?.correctAnswer === answer.value ? 1 : 0);
    });
});

test('should list users', async () => {
    const { adminTrpc, USERS } = await getTestData();
    const users = await adminTrpc.users.list();
    const dbUsers = USERS.map(({id, name, email, surname, username}) => {
        return {
            id,
            name,
            email,
            surname,
            username
        };
    });
    expect(users).toEqual(dbUsers);
});
