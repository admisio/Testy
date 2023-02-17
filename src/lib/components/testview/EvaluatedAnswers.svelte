<script lang="ts">
    // TODO: Jedna answer komponenta pro Answers a EvaluatedAnswers
    export let answers: Array<string>;

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    export let selectedAnswerIndex: number | null = null;
    export let selectedAnswerEval: number;
</script>

<div
    class="flex w-full flex-col rounded-md border-[0.1rem] px-4 py-2 shadow-lg dark:bg-gray-800 dark:text-gray-200"
>
    {#each answers as answer, i}
        <button
            disabled
            class="mt-4 flex w-full p-2 hover:cursor-pointer"
            class:selected={selectedAnswerIndex === i}
            class:correct={selectedAnswerIndex === i && selectedAnswerEval >= 1}
            class:incorrect={selectedAnswerIndex === i && selectedAnswerEval <= 0}
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
        @apply bg-green-600 font-bold;
    }
    .incorrect {
        @apply bg-red-600;
    }
</style>
