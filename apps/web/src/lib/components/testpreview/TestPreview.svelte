<script lang="ts">
    import type { Prisma } from '@testy/database';

    export let test: Prisma.TemplateGetPayload<{
        select: {
            questions: {
                select: {
                    title: true;
                    description: true;
                    correctAnswer: true;
                    templateAnswers: true;
                };
            };
            headings: {
                select: {
                    title: true;
                    description: true;
                    questionRangeStart: true;
                };
            };
        };
    }>;
</script>

{#if test}
    {@const questions = test.questions}
    {@const headings = test.headings}
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
            <h2>{i + 1}. {@html question.title}</h2>
            {#if question.description}
                <div class="description">{@html question.description}</div>
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
