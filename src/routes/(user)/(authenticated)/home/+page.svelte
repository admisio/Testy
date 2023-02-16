<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import AssignedTestCard from '$lib/components/test/AssignedTestCard.svelte';
    import type { Prisma } from '@prisma/client';
    import { onDestroy } from 'svelte';
    import type { PageData } from './test/$types';

    export let data: PageData;
    $: assignedTests = data.assignedTests as Prisma.AssignedTestGetPayload<{
        include: {
            test: true;
            submissions: {
                select: {
                    testId: true;
                };
            };
        };
    }>[];

    const interval = setInterval(invalidateAll, 1000);

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4  py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Přidělené aktivní testy</h1>
</div>
<div
    class="<md:flex-col mx-auto mx-auto flex max-w-screen-xl flex-wrap justify-between px-4 py-3 md:px-6"
>
    <!-- TODO: Věc backendu??? => Přesunout na backend validaci zda je test aktivní -->
    {#each assignedTests as assignedTest}
        {@const finished =
            (assignedTest.started &&
                assignedTest.endTime != null &&
                assignedTest.endTime < new Date()) ||
            (assignedTest.submissions.length > 0 &&
                assignedTest.submissions.some(
                    (submission) => submission.testId === assignedTest.testId
                ))}
        {#if !finished}
            <AssignedTestCard {assignedTest} />
        {/if}
    {/each}
</div>
