<script lang="ts">
    import Answers from '$lib/components/testview/Answers.svelte';
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';

    import { SvelteToast } from '@zerodevx/svelte-toast';
    import Button from '$lib/components/buttons/Button.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import { formatDate, formatTime, remainingTime } from '$lib/utils/date';
    import DarkMode from '$lib/components/DarkMode.svelte';

    import clippy from '$lib/assets/clippy.png';

    export let data: PageData;
    const headingRows = getInBetweenQuestionRows(
        data.assignment.template.questions,
        data.assignment.template.headings
    );

    let test: typeof data.assignment;
    $: test = data.assignment!;

    const submitAnswer = async (e: any, questionId: number) => {
        const { answerIndex, runOnSuccess } = e.detail;
        try {
            await trpc().assignments.submitAnswer.mutate({
                assignmentId: test.id,
                answerIndex,
                questionId
            });
            runOnSuccess();
        } catch (error) {
            pushErrorText('Test skončil');
            e.preventDefault();
        }
    };

    let submitModalIsOpen = false;

    let endTimeFixed = false;

    let isDarkMode: boolean = false;

    import 'highlight.js/styles/github-dark.css';

    import { onDestroy, onMount } from 'svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { pushErrorText } from '$lib/utils/toast';
    import type { Heading } from '@testy/database';
    import { getInBetweenQuestionRows } from '$lib/utils/headings';

    onMount(() => {
        updateTimeRemaining();
        updateTimeRemainingInterval = setInterval(() => updateTimeRemaining(), 1000);
    });

    const submitTest = async () => {
        await trpc().assignments.submittemplate.mutate({ assignmentId: test.id });
        goto('/home/test/' + test.id + '/result');
    };

    let timeRemaining: string;

    const updateTimeRemaining = () => {
        if (test.endTime && test.endTime < new Date()) {
            timeRemaining = 'Test skončil';
            clearInterval(updateTimeRemainingInterval);
        } else {
            const remaining = remainingTime(test.endTime);
            timeRemaining = remaining ? remaining : '-';
        }
    };

    let updateTimeRemainingInterval: NodeJS.Timer;

    onDestroy(() => {
        clearInterval(updateTimeRemainingInterval);
    });

    let submittedAnswersCount = 0;
    $: submittedAnswersCount = test.template.questions.filter(
        (question) => question.submittedAnswers.length > 0
    ).length;

    $: answersCount = test.template.questions.length;
</script>

<SvelteToast />

{#if submitModalIsOpen}
    <Modal on:close={() => (submitModalIsOpen = false)}>
        <div
            class="md:w-screen-md mx-auto mx-auto mb-6 flex max-w-screen-xl flex-col items-center p-4"
        >
            <h1 class="<md:mb-3 text-4xl font-black text-black">
                Přejete si <u>nenávratně</u> odevzdat test?
            </h1>
            <p class="mt-4 text-xl text-gray-500">
                Po odevzdání testu již nebude možné jej upravovat.
            </p>
            <p class="mt-4 text-xl text-gray-500">
                Odevzdáte test s {submittedAnswersCount} / {answersCount} odpověďmi.
            </p>

            <img class="w-72" src={clippy} alt="Clippy" />
            <button
                class="mt-6 animate-bounce rounded-md bg-yellow-600 p-3 text-xl text-white shadow-md transition-colors duration-300 hover:bg-yellow-800"
                on:click={() => submitTest()}>Odevzdat test</button
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
    <span class="text-sm font-medium text-gray-500"
        >Test skončí v {formatTime(test.endTime)} / {timeRemaining}
    </span>
    <div
        class="ml-4 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 hover:shadow-lg dark:bg-black dark:text-gray-200"
    >
        <DarkMode bind:isDarkMode />
    </div>
</div>

<div class:dark={isDarkMode} class="w-100vw mt-12 flex h-full justify-center">
    <div class="md:w-7/10 w-[95%] px-3 py-6 shadow-2xl dark:bg-gray-700 md:px-24">
        {#each test.template.questions as question, i}
            {#if headingRows[i]}
                {@const heading = headingRows[i]}
                <div class="mt-12 w-full">
                    {#if heading && heading.title}
                        <h2
                            class="text-ellipsis break-words text-center text-2xl font-bold dark:text-gray-400 md:text-left"
                        >
                            {@html heading.title}
                        </h2>
                    {/if}
                    {#if heading && heading.description}
                        <p
                            class="mt-4 text-ellipsis break-words text-justify font-serif text-xl dark:text-gray-400"
                        >
                            {@html heading.description}
                        </p>
                    {/if}
                </div>
            {/if}
            <div class="mt-12 w-full">
                <div class="title-wrapper">
                    <h2
                        class="text-ellipsis break-words text-center text-2xl font-bold dark:text-gray-400 md:text-left"
                    >
                        {i + 1}. {@html question.title}
                    </h2>
                </div>
                {#if question.description}
                    <div class="description mt-8 break-words font-serif dark:text-gray-200">
                        {@html '\n' + question.description}
                    </div>
                {/if}
                <div class="mt-6">
                    <Answers
                        on:submit={(e) => submitAnswer(e, question.id)}
                        answers={question.templateAnswers}
                        selectedAnswerIndex={question.submittedAnswers[0]
                            ? question.templateAnswers.indexOf(question.submittedAnswers[0].value)
                            : -1}
                        readOnly={!test.endTime || test.endTime < new Date()}
                    />
                </div>
            </div>
        {/each}
    </div>
</div>

<div class="my-10 flex w-full items-center justify-center">
    <Button
        title="Odeslat test"
        on:click={async () => {
            await invalidateAll();
            submitModalIsOpen = true;
        }}
    />
</div>

<style lang="postcss">
    .title-wrapper :global(code) {
        @apply rounded-md bg-[#1D1D1E] px-1 py-1 text-[#D4D4D4];
    }
    .endTimeFixed {
        @apply fixed;
    }
    :global(code) {
        white-space: pre;
    }
</style>
