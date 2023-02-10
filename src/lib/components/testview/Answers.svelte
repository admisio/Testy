<script lang="ts">
    import { pushErrorText } from "$lib/trpc/utils/toast";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let answers: Array<string>;
    export let submittedAnswer = '';
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

<div class="flex w-full flex-col bg-[#1D1D1E] border-[0.1rem] border-[#3F3F46] rounded-md px-4 py-2">
    {#each answers as answer, i}
        <div
            class="flex mt-4 w-full hover:cursor-pointer"
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
            <span class="font-bold self-center">{`${alphabet[i]})`}</span>
            <span class="ml-4">{answer}</span>
        </div>
    {/each}
</div>

<style lang="postcss">
    .selected {
        /* @apply bg-[#009400]; */
        @apply bg-[#003100] border-[0.1rem] border-[#009400];
    }
</style>
