<script lang="ts">
    import Answers from '$lib/components/testview/Answers.svelte';
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';

    export let data: PageData;
    const test = data.test!;

    console.log(test.test.questions[2].description);

    const questions = test.test.questions;
    const answers: Array<string> = new Array<string>(questions.length);
    for (let i = 0; i < answers.length; i++) {
        if (questions[i].submittedAnswers[0]) {
            answers[i] = questions[i].submittedAnswers[0].value;
        }
    }
    console.log(answers);
    /* const submitAnswer = async (e: Event, questionId: number) => {
        const value = (e.target as HTMLInputElement).value;
        await trpc().assignedTests.submitAnswer.mutate({
            assignedTestId: test.id,
            answer: value,
            questionId
        });
    }; */
    const submitAnswer = async (e: any, questionId: number) => {
        const answer = e.detail.answer;
        await trpc().assignedTests.submitAnswer.mutate({
            assignedTestId: test.id,
            answer,
            questionId
        });
    };
</script>

<h1>Test was {test.id} assigned to you</h1>
<h2>Start time: {test.startTime}</h2>
<h2>End time: {test.endTime}</h2>

<h1>{test.test.title}</h1>
<div class="flex-row flex">
    <div class="w-[20%]" />
    <div class="w-[70%]">
        {#each test.test.questions as question, i}
            <div class="mt-12 w-full">
                <h2 class="text-2xl font-bold">{i + 1}. {@html question.title}</h2>
                {#if question.description}
                    <div class="mt-8">
                        <pre>
                            {@html question.description}
                        </pre>
                    </div>
                {/if}
                <div class="mt-6">
                    <Answers
                        on:submit={(e) => submitAnswer(e, question.id)}
                        answers={question.answers}
                        selectedAnswerIndex={question.submittedAnswers[0]
                            ? question.answers.indexOf(answers[i])
                            : -1}
                        submittedAnswer={question.submittedAnswers[0]
                            ? question.submittedAnswers[0].value
                            : ''}
                    />
                </div>
                <!-- <select on:input={(e) => submitAnswer(e, question.id)} bind:value={answers[i]}>
                    {#each question.answers as answer}
                        <option>{answer}</option>
                    {/each}
                </select> -->
            </div>
        {/each}
    </div>
</div>

<button
    class="mt-8 bg-red-700 font-bold text-4xl"
    on:click={() => trpc().assignedTests.submitTest.mutate({ assignedTestId: test.id })}
    >Submit test</button
>

<style lang="postcss">
</style>
