<script lang="ts">
    import { pushErrorText } from '$lib/utils/toast';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let answers: Array<string>;

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    export let selectedAnswerIndex: number | null = null;
    export let selectedAnswerEval: number;
    export let readOnly = false;

    const submit = async (index: number) => {
        if (readOnly) {
            pushErrorText('Test již skončil');
            return;
        }
        selectedAnswerIndex = index;
        dispatch('submit', {
            answer: answers[index]
        });
    };
</script>

<div
    class="flex w-full flex-col rounded-md border-[0.1rem] px-4 py-2 shadow-lg dark:bg-gray-800 dark:text-gray-200"
    class:cursor-not-allowed={readOnly}
>
    {#each answers as answer, i}
        <button
            class="mt-4 flex w-full p-2 hover:cursor-pointer"
            class:hover:cursor-not-allowed={readOnly}
            class:selected={selectedAnswerIndex === i}
            class:correct={selectedAnswerIndex === i && selectedAnswerEval >= 1}
            class:incorrect={selectedAnswerIndex === i && selectedAnswerEval <= 0}
            on:click={(_) => submit(i)}
        >
            <span class="self-center font-bold">{`${alphabet[i]})`}</span>
            <span class="ml-4">{answer}</span>
        </button>
    {/each}
</div>

<style lang="postcss">
    .selected {
        @apply rounded-lg text-white;
    }
    .correct {
        @apply bg-green-600;
    }
    .incorrect {
        @apply bg-red-600;
    }
</style>
