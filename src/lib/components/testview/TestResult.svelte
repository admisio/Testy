<script lang="ts">
    import { trpc } from '$lib/trpc/client';

    import { SvelteToast } from '@zerodevx/svelte-toast';
    import { formatDate } from '$lib/utils/date';
    import DarkMode from '$lib/components/DarkMode.svelte';

    export let test: {
        submittedAnswers: Answer[];
        test: {
            questions: Question[];
            id: number;
            title: string;
        };
        id: number;
        startTime: Date | null;
        endTime: Date | null;
    };
    export let submission: TestSubmission;

    // dictioary of questionId -> answer
    const answers = new Map<number, Answer>();
    test.submittedAnswers.forEach((answer) => {
        const question = test.test.questions.find((q) => q.id === answer.questionId)!;
        answers.set(question.id, answer);
        console.log(question.id, answer);
    });

    let submitModalIsOpen = false;

    let endTimeFixed = false;

    let isDarkMode: boolean = false;

    import hljs from 'highlight.js';
    import 'highlight.js/styles/github-dark.css';

    import { onMount } from 'svelte';
    import type { Answer, Question, TestSubmission } from '@prisma/client';
    import EvaluatedAnswers from '$lib/components/testview/EvaluatedAnswers.svelte';
    import Modal from '../Modal.svelte';

    onMount(() => {
        document.querySelectorAll('.description code').forEach((el) => {
            hljs.highlightElement(el as HTMLElement);
        });
    });
</script>

<SvelteToast />

{#if submitModalIsOpen}
    <Modal on:close={() => (submitModalIsOpen = false)}>
        <div
            class="w-screen-md mx-auto mx-auto mb-6 flex max-w-screen-xl flex-col items-center p-4"
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
    on:click={() => {
        endTimeFixed = !endTimeFixed;
    }}
    class="absolute right-7 top-4 flex cursor-pointer items-center rounded-md bg-gray-200 px-6 py-4 hover:bg-gray-300"
    class:endTimeFixed
    class:dark={isDarkMode}
>
    <span class="text-sm font-medium text-gray-500">Test skončí v {formatDate(test.endTime)}</span>
    <div
        class="ml-4 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 hover:shadow-lg dark:bg-black dark:text-gray-200"
    >
        <DarkMode bind:isDarkMode />
    </div>
</div>

<div class:dark={isDarkMode} class="w-100vw mt-12 flex h-full justify-center">
    <div class="md:w-7/10 w-[95%] px-3 py-6 shadow-2xl dark:bg-gray-700 md:px-24">
        <div class="flex justify-center rounded-md bg-gray-600 px-4 py-4 shadow-md">
            <span class="flex text-center text-2xl font-bold text-white">
                Váš výsledek: <span class="ml-2">
                    {submission.evaluation}/10 bodů
                </span>
            </span>
        </div>
        {#each test.test.questions as question, i}
            <div class="mt-12 w-full">
                <div class="title-wrapper flex justify-between align-middle">
                    <h2 class="text-center text-2xl font-bold dark:text-gray-400 md:text-left">
                        {i + 1}. {@html question.title}
                    </h2>
                    <div class="min-w-48 relative">
                        {#if answers.has(question.id)}
                            {#if answers.get(question.id)?.evaluation === 1}
                                <span
                                    class="absolute right-0 bottom-0 ml-2 text-xl font-bold text-green-500"
                                    >Správně (1/1 bodů)</span
                                >
                            {:else}
                                <span
                                    class="absolute right-0 bottom-0 ml-2 text-xl font-bold text-red-500"
                                    >Špatně (0/1 bodů)</span
                                >
                            {/if}
                        {:else}
                            <span
                                class="absolute right-0 bottom-0 ml-2 text-xl font-bold text-red-500"
                                >Bez odpovědi (0/1)</span
                            >
                        {/if}
                    </div>
                </div>
                {#if question.description}
                    <div class="description mt-8 dark:text-gray-200">
                        <pre>
                            {@html '\n' + question.description}
                        </pre>
                    </div>
                {/if}
                <div class="mt-6">
                    <EvaluatedAnswers
                        answers={question.answers}
                        selectedAnswerIndex={answers.has(question.id)
                            ? question.answers.indexOf(answers.get(question.id)?.value ?? '')
                            : -1}
                        selectedAnswerEval={answers.get(question.id)?.evaluation ?? 0}
                        readOnly={!test.endTime || test.endTime < new Date()}
                    />
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="postcss">
    .title-wrapper :global(code) {
        @apply rounded-md bg-[#1D1D1E] py-1 px-1 text-[#D4D4D4];
    }
    .endTimeFixed {
        @apply fixed;
    }
    :global(code) {
        white-space: pre;
    }
</style>
