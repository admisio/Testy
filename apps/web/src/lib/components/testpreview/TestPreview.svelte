<script lang="ts">
    import { getInBetweenQuestionRows } from '$lib/utils/headings';
    import type { Prisma } from '@testy/database';

    export let test: Prisma.TemplateGetPayload<{
        select: {
            questions: {
                select: {
                    title: true;
                    description: true;
                    correctAnswer: true;
                    templateAnswers: true;
                    headingId: true;
                };
            };
            headings: true;
        };
    }>;

    console.log('template preview', test.headings);

    const headingRows = getInBetweenQuestionRows(test.questions, test.headings);
</script>

{#if test}
    {@const questions = test.questions}
    <div
        class="mx-auto mx-auto flex max-w-screen-xl flex-col flex-wrap justify-between px-4 py-3 md:px-6"
    >
        {#each questions as question, i}
            {#if headingRows[i]}
                {@const heading = headingRows[i]}
                <div class="w-full">
                    {#if heading && heading.title}
                        <h2
                            class="text-ellipsis break-words text-center text-2xl font-bold dark:text-gray-400 md:text-left"
                        >
                            {@html heading.title}
                        </h2>
                    {/if}
                    {#if heading && heading.description}
                        <p class="mt-4 text-ellipsis break-words text-xl font-serif dark:text-gray-400">
                            {@html heading.description}
                        </p>
                    {/if}
                </div>
            {/if}
            <h2>{i + 1}. {@html question.title}</h2>
            {#if question.description}
                <div class="description font-serif">{@html question.description}</div>
            {/if}
            <ul>
                {#each question.templateAnswers as answer}
                    {#if question.correctAnswer === answer}
                        <li class="correct">{answer}</li>
                    {:else}
                        <li>{answer}</li>
                    {/if}
                {/each}
            </ul>
        {/each}
    </div>
{/if}

<style lang="postcss">
    h2 {
        @apply my-4;
    }
    ul {
        @apply border border-2;
    }
    ul .correct {
        @apply font-bold text-green-700;
    }
</style>
