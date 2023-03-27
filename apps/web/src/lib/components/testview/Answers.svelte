<script lang="ts">
    import { pushErrorText } from '$lib/utils/toast';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let answers: Array<string>;

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    export let selectedAnswerIndex: number | null = null;

    export let selectedAnswerEval: number | null = null;

    export let readOnly = selectedAnswerEval != null ? true : false;

    const submit = async (index: number) => {
        if (selectedAnswerIndex === index) return;

        if (readOnly || selectedAnswerEval) {
            pushErrorText('Test již skončil');
            return;
        }

        dispatch(
            'submit',
            {
                answerIndex: index,
                runOnSuccess: () => {
                    selectedAnswerIndex = index;
                }
            },
            { cancelable: true }
        );
    };
</script>

<div
    class="flex w-full flex-col rounded-md border-[0.1rem] px-4 py-2 shadow-lg dark:bg-gray-800 dark:text-gray-200"
>
    {#each answers as answer, i}
        <button
            disabled={readOnly}
            class="mt-4 flex w-full p-2 hover:cursor-pointer"
            class:readOnly
            class:selected={selectedAnswerIndex === i}
            class:correct={selectedAnswerEval != null &&
                selectedAnswerIndex === i &&
                selectedAnswerEval >= 1}
            class:incorrect={selectedAnswerEval != null &&
                selectedAnswerIndex === i &&
                selectedAnswerEval <= 0}
            on:click={(_) => submit(i)}
        >
            <span class="self-center font-bold">{`${alphabet[i]})`}</span>
            <span class="ml-4 text-left w-full">{@html answer.replaceAll(/\n/g, '<br/>')}</span>
        </button>
    {/each}
</div>

<style lang="postcss">
    .selected {
        @apply rounded-lg bg-green-600 text-white;
    }
    .correct {
        @apply bg-green-600 font-bold;
    }
    .incorrect {
        @apply bg-red-600;
    }
    .readOnly {
        @apply cursor-not-allowed;
    }
</style>
