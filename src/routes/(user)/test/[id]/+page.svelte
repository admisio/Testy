<script lang="ts">
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';

    export let data: PageData;
    const test = data.test!;

    const questions = test.test.questions;
    const answers: Array<string> = new Array<string>(questions.length);
    for (let i = 0; i < answers.length; i++) {
        if (questions[i].submittedAnswers[0]) {
            answers[i] = questions[i].submittedAnswers[0].value;
        }
    }
    const submitAnswer = async (e: Event, questionId: number) => {
        const value = (e.target as HTMLInputElement).value;
        await trpc().assignedTests.submitAnswer.mutate({
            assignedTestId: test.id,
            answer: value,
            questionId
        });
    };
</script>

<h1>Test was {test.id} assigned to you</h1>
<h2>Start time: {test.startTime}</h2>
<h2>End time: {test.endTime}</h2>

<h1>{test.test.title}</h1>
{#each test.test.questions as question, i}
    <h2 class="text-xl font-bold">{question.id} {question.title}</h2>
    <div>{@html question.description}</div>
    <ul>
        {#each question.answers as answer}
            <li>{answer}</li>
        {/each}
    </ul>
    <select on:input={(e) => submitAnswer(e, question.id)} bind:value={answers[i]}>
        {#each question.answers as answer}
            <option>{answer}</option>
        {/each}
    </select>
{/each}

<button class="mt-8 bg-red-700 font-bold text-4xl" on:click={() => trpc().assignedTests.submitTest.mutate({assignedTestId: test.id})}>Submit test</button>