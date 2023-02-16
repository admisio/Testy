<script lang="ts">
    import Answers from '$lib/components/testview/Answers.svelte';
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';

    import { SvelteToast } from '@zerodevx/svelte-toast';
    import Button from '$lib/components/buttons/Button.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import { formatDate } from '$lib/utils/date';

    export let data: PageData;
    const test = data.test!;
    const user = data.user!;

    console.log(test.test.questions[2].description);

    const questions = test.test.questions;
    const answers: Array<string> = new Array<string>(questions.length);
    for (let i = 0; i < answers.length; i++) {
        if (questions[i].submittedAnswers[0]) {
            console.log(
                'question id: ' +
                    questions[i].id +
                    ' answer: ' +
                    questions[i].submittedAnswers[0].value +
                    ''
            );
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

    let submitModalIsOpen = false;

    let endTimeFixed = true;
</script>

<SvelteToast />

{#if submitModalIsOpen}
    <Modal on:close={() => (submitModalIsOpen = false)}>
        <div
            class="w-screen-md mx-auto mx-auto mb-6 flex max-w-screen-xl  flex-col items-center p-4"
        >
            <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Přejete si odeslat test?</h1>
            <!-- TODO: Pěkný UI -->
            <button
                class="p-3"
                on:click={() => trpc().assignedTests.submitTest.mutate({ assignedTestId: test.id })}
                >Odevzdat test</button
            >
        </div>
    </Modal>
{/if}

<div
    on:keydown={null}
    on:click={() => (endTimeFixed = !endTimeFixed)}
    class="absolute right-7 top-4 cursor-pointer rounded-md bg-gray-200 px-6 py-4 hover:bg-gray-300"
    class:endTimeFixed
>
    <span class="text-md font-medium text-gray-500">Test skončí v {formatDate(test.endTime)}</span>
</div>

<div class="w-100vw mt-12 flex h-full justify-center">
    <div class="w-[70%] px-24 shadow-2xl py-6">
        {#each test.test.questions as question, i}
            <div class="mt-12 w-full">
                <div class="title-wrapper">
                    <h2 class="text-2xl font-bold">{i + 1}. {@html question.title}</h2>
                </div>
                {#if question.description}
                    <div class="description-wrapper language-javascript mt-8">
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
                        readOnly={!test.endTime || test.endTime < new Date()}
                    />
                </div>
            </div>
        {/each}
    </div>
</div>

<div class="my-10 flex w-full items-center justify-center">
    <Button title="Odeslat test" on:click={() => (submitModalIsOpen = true)} />
</div>

<style lang="postcss">
    .title-wrapper :global(code) {
        /* @apply bg-[#1D1D1E] text-[#D4D4D4] rounded-md; */
        /* can style code parts of title */
        @apply rounded-md bg-[#1D1D1E] py-1 px-1 text-[#D4D4D4];
    }
    .endTimeFixed {
        @apply fixed;
    }
</style>
