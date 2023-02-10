<script lang="ts">
    import type { Question } from "$lib/trpc/model/Question";
    import type { PageData } from "./$types";


    export let data: PageData;
    const test = data.test!;
    const questions = test.questions.map((q) => q as unknown as Question); 
</script>

<h1>Úprava testu</h1>

<h1>{test.title}</h1>
{#each questions as question}
    <h2>{question.title}</h2>
    <div>{@html question.description}</div>
    <ul>
        {#each question.answers as answer}
            <li>{answer}</li>
        {/each}
    </ul>
{/each}