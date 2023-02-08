<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';

    export let data: PageData;
    const assignedTests = data.assignedTests!;
</script>

<h1 class="font-bold text-6xl">Přidělené testy</h1>
{#each assignedTests as test, i}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p on:click={(_) => goto('/test/' + i)} class="hover:cursor-pointer text-red-700">
        {test.test.title} (started: {test.started ? `yes ${test.startTime} - ${test.endTime}` : 'no'})
    </p>
{/each}
