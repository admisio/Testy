<script lang="ts">
    import type { PageData } from "./$types";


    export let data: PageData;
    const test = data.test!;
</script>


<h1>Test was {test.id} assigned to you</h1>
<h2>Start time: {test.startTime}</h2>
<h2>End time: {test.endTime}</h2>

<h1>{test.test.title}</h1>
{#each test.test.questions as question}
    <h2 class="text-xl font-bold">{question.title}</h2>
    <ul>
        {#each question.content.answers as answer}
            <li>{answer}</li>
        {/each}
    </ul>
{/each}