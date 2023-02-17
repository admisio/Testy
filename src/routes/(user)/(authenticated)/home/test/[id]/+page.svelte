<script lang="ts">
    import Answers from '$lib/components/testview/Answers.svelte';
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';

    import { SvelteToast } from '@zerodevx/svelte-toast';
    import Button from '$lib/components/buttons/Button.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import { formatDate } from '$lib/utils/date';
    import DarkMode from '$lib/components/DarkMode.svelte';

    export let data: PageData;
    const test = data.test!;

    const submitAnswer = async (e: any, questionId: number) => {
        const answer = e.detail.answer;
        await trpc().assignedTests.submitAnswer.mutate({
            assignedTestId: test.id,
            answer,
            questionId
        });
    };

    let submitModalIsOpen = false;

    let endTimeFixed = false;

    let isDarkMode: boolean = false;

    import hljs from 'highlight.js';
    import 'highlight.js/styles/github-dark.css';

    import { onMount } from 'svelte';

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
    class="flex items-center absolute right-7 top-4 cursor-pointer rounded-md bg-gray-200 px-6 py-4 hover:bg-gray-300"
    class:endTimeFixed
    class:dark={isDarkMode}
>
    <span class="text-sm font-medium text-gray-500">Test skončí v {formatDate(test.endTime)}</span>
    <div
        class="hover:shadow-lg ml-4 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 dark:bg-black dark:text-gray-200"
    >
        <DarkMode bind:isDarkMode />
    </div>
</div>

<div class:dark={isDarkMode} class="w-100vw mt-12 flex h-full justify-center">
    <div class="w-[95%] md:w-7/10 px-3 md:px-24 py-6 shadow-2xl dark:bg-gray-700">
        {#each test.test.questions as question, i}
            <div class="mt-12 w-full">
                <div class="title-wrapper">
                    <h2 class="text-center md:text-left text-2xl font-bold dark:text-gray-400">
                        {i + 1}. {@html question.title}
                    </h2>
                </div>
                {#if question.description}
                    <div class="description mt-8 dark:text-gray-200">
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
                            ? question.answers.indexOf(question.submittedAnswers[0].value)
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
        @apply bg-[#1D1D1E] text-[#D4D4D4] py-1 px-1 rounded-md;
    }
    .endTimeFixed {
        @apply fixed;
    }
    :global(code) {
        white-space: pre;
    }
</style>
