<script lang="ts">
    import type { Question } from '$lib/trpc/model/Question';
    import type { PageData } from './$types';

    export let data: PageData;
    const test = data.test!;
    const questions = test.questions.map((q) => q as unknown as Question);
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4 px-4 py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Úprava testu / {test.title}</h1>
</div>

<div
    class="mx-auto mx-auto flex max-w-screen-xl  flex-col flex-wrap justify-between px-4 py-3 md:px-6"
>
    {#each questions as question}
        <h2>{@html question.title}</h2>
        <div class="html">{@html question.description}</div>
        <ul>
            {#each question.answers as answer}
                <li>{answer}</li>
            {/each}
        </ul>
    {/each}
</div>

<style>
    h2 {
        @apply mt-6;
        @apply text-blue-400;
    }
    .html {
        @apply border;
    }
</style>
