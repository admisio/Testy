<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
    const test = data.template!;
    const questions = test.questions;
    const headings = test.headings;

    import hljs from 'highlight.js';
    import 'highlight.js/styles/github.css';

    import { onMount } from 'svelte';

    onMount(() => {
        document.querySelectorAll('.description code').forEach((el) => {
            hljs.highlightElement(el as HTMLElement);
        });
    });
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4 px-4 py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Úprava testu / {test.title}</h1>
</div>
<div
    class="mx-auto mx-auto flex max-w-screen-xl  flex-col flex-wrap justify-between px-4 py-3 md:px-6"
>
    {#each questions as question, i}
        {#if headings.some((heading) => heading.questionRangeStart === i + 1)}
            {#each headings.filter((heading) => heading.questionRangeStart === i + 1) as heading}
                <div class="w-full">
                    {#if heading.title}
                        <h2
                            class="text-ellipsis break-all text-center text-2xl font-bold dark:text-gray-400 md:text-left"
                        >
                            {@html heading.title}
                        </h2>
                    {/if}
                    {#if heading.description}
                        <p class="mt-4 text-ellipsis break-all text-xl ">
                            {@html heading.description}
                        </p>
                    {/if}
                </div>
            {/each}
        {/if}
        <h2>{@html question.title}</h2>
        {#if question.description}
            <div class="description">{@html question.description}</div>
        {/if}
        <ul>
            {#each question.templateAnswers as answer}
                {#if question.correctAnswer === answer}
                    <li class="font-bold text-green-700">{answer}</li>
                {:else}
                    <li>{answer}</li>
                {/if}
            {/each}
        </ul>
    {/each}
</div>

<style lang="postcss">
    h2 {
        @apply mt-6;
        @apply text-blue-400;
        @apply text-xl;
    }
    .description {
        @apply border;
    }
</style>
