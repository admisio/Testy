<script lang="ts">
    // TODO: Jedna test komponenta pro OpenTest a TestResult
    import DarkMode from '$lib/components/DarkMode.svelte';

    export let assignment: Prisma.AssignmentGetPayload<{
        select: {
            id: true;
            startTime: true;
            endTime: true;
            submittedAnswers: true;
            template: {
                select: {
                    id: true;
                    title: true;
                    maxScore: true;
                    questions: true;
                };
            };
        };
    }>;

    export let submission: Submission;

    // dictioary of questionId -> answer
    const answers = new Map<number, Answer>();
    assignment.submittedAnswers.forEach((answer) => {
        const question = assignment.template.questions.find((q) => q.id === answer.questionId)!;
        answers.set(question.id, answer);
        console.log(question.id, answer);
    });

    let endTimeFixed = false;

    let isDarkMode: boolean = false;

    import hljs from 'highlight.js';
    import 'highlight.js/styles/github-dark.css';

    import { onMount } from 'svelte';
    import type { Answer, Prisma, Question, Submission } from '@testy/database';

    import Answers from './Answers.svelte';

    onMount(() => {
        document.querySelectorAll('.description code').forEach((el) => {
            hljs.highlightElement(el as HTMLElement);
        });
    });
</script>

<div
    on:keydown={null}
    on:click={() => {
        endTimeFixed = !endTimeFixed;
    }}
    class="absolute right-7 top-4 flex cursor-pointer items-center rounded-md bg-gray-200 px-6 py-4 hover:bg-gray-300"
    class:endTimeFixed
    class:dark={isDarkMode}
>
    <div
        class="flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 hover:shadow-lg dark:bg-black dark:text-gray-200"
    >
        <DarkMode bind:isDarkMode />
    </div>
</div>

<div class:dark={isDarkMode} class="w-100vw mt-12 flex h-full justify-center">
    <div class="md:w-7/10 mb-12 w-[95%] px-3 py-6 shadow-2xl dark:bg-gray-700 md:px-24">
        <div class="flex justify-center rounded-md bg-gray-600 px-4 py-4 shadow-md">
            <span class="flex text-center text-2xl font-bold text-white">
                Váš výsledek: <span class="ml-2">
                    {submission.evaluation}/{assignment.template.maxScore} bodů
                </span>
            </span>
        </div>
        {#each assignment.template.questions as question, i}
            <div class="mt-12 w-full">
                <div class="title-wrapper">
                    <h2 class="text-ellipsis break-all text-center text-2xl font-bold dark:text-gray-400 md:text-left">
                        {i + 1}. {@html question.title}
                    </h2>
                </div>
                <div class="min-w-48 mt-2 ">
                    {#if answers.has(question.id)}
                        {#if answers.get(question.id)?.evaluation === 1}
                            <span class="text-xl font-bold text-green-500"
                                >Správně (1/1 bodů)</span
                            >
                        {:else}
                            <span class="text-xl font-bold text-red-500">Špatně (0/1 bodů)</span
                            >
                        {/if}
                    {:else}
                        <span class="text-xl font-bold text-red-500">Bez odpovědi (0/1)</span>
                    {/if}
                </div>
                {#if question.description}
                    <div class="description mt-8 dark:text-gray-200">
                        {@html '\n' + question.description}
                    </div>
                {/if}
                <div class="mt-6">
                    <Answers
                        readOnly
                        answers={question.templateAnswers}
                        selectedAnswerIndex={answers.has(question.id)
                            ? question.templateAnswers.indexOf(answers.get(question.id)?.value ?? '')
                            : -1}
                        selectedAnswerEval={answers.get(question.id)?.evaluation ?? 0}
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
