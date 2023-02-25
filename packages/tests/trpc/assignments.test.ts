import { expect, test, beforeEach } from 'vitest';
import { resetDb } from '../reset';
import adminTrpc from '../trpc';
import { addMinutes } from 'date-fns';
import { QUESTIONS } from '../lib/data';
import { router } from '@testy/trpc/server/router';

beforeEach(async () => {
    await resetDb();
});

test('should assign test template to group', async () => {
    await adminTrpc.assignments.assignToGroup({
        templateId: 1,
        groupId: 1
    });
    const assignment = (await adminTrpc.assignments.list())[0];
    expect(assignment.groupId).toBe(1);
    expect(assignment.started).toBe(false);
});

test('should start assignment with correct endTime', async () => {
    await adminTrpc.assignments.assignToGroup({
        templateId: 1,
        groupId: 1
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
    await adminTrpc.assignments.assignToGroup({
        templateId: 1,
        groupId: 1
    });
    const assignment = (await adminTrpc.assignments.list())[0];
    await adminTrpc.assignments.start({
        assignmentId: assignment.id
    });
    const trpc = router.createCaller({ userId: '1', role: 'user' });
    for (let i = 0; i < QUESTIONS.length; i++) {
        const question = QUESTIONS[i];
        await trpc.assignments.submitAnswer({
            assignmentId: assignment.id,
            questionId: question.id,
            answer: 'answer' + (i % 4) // predictable result
        });
    }
    const data = await trpc.assignments.get({ assignmentId: assignment.id });
    data.assignment.template.questions.forEach((question, i) => {
        expect(question.submittedAnswers[0].value).toEqual('answer' + (i % 4));
    });

    await trpc.assignments.submittemplate({ assignmentId: assignment.id });

    const submission = await trpc.submissions.get({ assignmentId: assignment.id });
    expect(submission.evaluation).toEqual(Math.floor(QUESTIONS.length / 4));
    expect(submission.assignment.submittedAnswers).toHaveLength(QUESTIONS.length);
    submission.assignment.submittedAnswers.forEach((answer, i) => {
        expect(answer.value).toEqual('answer' + (i % 4));
        expect(answer.evaluation).toEqual(QUESTIONS[i].correctAnswer === answer.value ? 1 : 0);
    });
});