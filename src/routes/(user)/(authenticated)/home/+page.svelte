<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './test/$types';

    export let data: PageData;
    const assignedTests = data.assignedTests!;
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4  py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Přidělené testy</h1>
</div>
<div class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl px-4  py-3 md:px-6 md:px-6">
    {#each assignedTests as test}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p on:click={(_) => goto('/test/' + test.id)} class="text-red-700 hover:cursor-pointer">
            {test.test.title} (started: {test.started
                ? `yes ${test.startTime} - ${test.endTime}`
                : 'no'})
        </p>
    {/each}
</div>
