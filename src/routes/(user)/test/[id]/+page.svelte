<script lang="ts">
    import Answers from '$lib/components/testview/Answers.svelte';
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';
    // import Prism from 'prismjs'; // TODO
    import { SvelteToast } from '@zerodevx/svelte-toast';
    import TestHeader from '$lib/components/testview/TestHeader.svelte';

    export let data: PageData;
    const test = data.test!;
    const user = data.user!;

    console.log(test.test.questions[2].description);

    const questions = test.test.questions;
    const answers: Array<string> = new Array<string>(questions.length);
    for (let i = 0; i < answers.length; i++) {
        if (questions[i].submittedAnswers[0]) {
            console.log("question id: " + questions[i].id + " answer: " + questions[i].submittedAnswers[0].value + "")
            answers[i] = questions[i].submittedAnswers[0].value;
        }
    }
    // highlight all code blocks // TODO
    /* if (typeof window !== 'undefined') {
        Prism.highlightAll();
    } */

    const submitAnswer = async (e: any, questionId: number) => {
        const answer = e.detail.answer;
        await trpc().assignedTests.submitAnswer.mutate({
            assignedTestId: test.id,
            answer,
            questionId
        });
    };
</script>

<SvelteToast />
<!-- <h1>Test was {test.id} assigned to you</h1>
<h2>Start time: {test.startTime}</h2>
<h2>End time: {test.endTime}</h2> -->
<div class="w-full h-16 fixed top-0 left-0 right-0">
    <TestHeader
        name={user.name}
        surname={user.surname}
        testTitle={test.test.title}
        endTime={test.endTime}
    />
</div>


<div class="flex justify-center mt-12 h-full w-100vw">
    <div class="w-[1px] bg-[#3F3F46] fixed -z-50 top-0 bottom-0 left-50"></div>
    <div class="w-[70%] px-24">
        {#each test.test.questions as question, i}
            <div class="mt-12 w-full">
                <div class="title-wrapper">
                    <h2 class="text-2xl font-bold">{i + 1}. {@html question.title}</h2>
                </div>
                {#if question.description}
                    <div class="mt-8 description-wrapper language-javascript">
                        <pre>
                            {@html '\n' + question.description}
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
                        readOnly={!test.endTime || test.endTime < new Date()}
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
    <div class="w-[1px] bg-[#3F3F46] fixed -z-50 top-0 bottom-0 right-50"></div>
</div>

<button
    class="mt-8 bg-red-700 font-bold text-4xl"
    on:click={() => trpc().assignedTests.submitTest.mutate({ assignedTestId: test.id })}
    >Submit test</button
>

<style lang="postcss">
    .title-wrapper :global(code) {
        /* @apply bg-[#1D1D1E] text-[#D4D4D4] rounded-md; */
        /* can style code parts of title */
        @apply bg-[#1D1D1E] text-[#D4D4D4] py-1 px-1 rounded-md;
    }
</style>
