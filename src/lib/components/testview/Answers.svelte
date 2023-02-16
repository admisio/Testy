<script lang="ts">
    import { pushErrorText } from '$lib/utils/toast';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let answers: Array<string>;

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    export let selectedAnswerIndex: number | null = null;
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
    class="flex w-full flex-col rounded-md border-[0.1rem] px-4 py-2 shadow-lg"
    class:cursor-not-allowed={readOnly}
>
    {#each answers as answer, i}
        <button
            class="mt-4 flex w-full p-2 hover:cursor-pointer"
            class:hover:cursor-not-allowed={readOnly}
            class:selected={selectedAnswerIndex === i}
            on:click={(_) => submit(i)}
        >
            <!-- dot icon -->
            <!-- <svg
                class="w-2 h-2 mr-2 self-center stroke-light-300 bg-light-300 rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                stroke="currentColor"
            /> -->
            <span class="self-center font-bold">{`${alphabet[i]})`}</span>
            <span class="ml-4">{answer}</span>
        </button>
    {/each}
</div>

<style lang="postcss">
    .selected {
        @apply rounded-lg  bg-green-600;
    }
</style>
