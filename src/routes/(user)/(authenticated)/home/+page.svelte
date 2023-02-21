<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import AssignmentCard from '$lib/components/test/AssignmentCard.svelte';
    import NoTestCard from '$lib/components/test/NoTestCard.svelte';
    import type { Prisma } from '@prisma/client';
    import { onDestroy } from 'svelte';
    import type { PageData } from './$types';

    type Assignment = Prisma.AssignmentGetPayload<{
        include: {
            template: true;
            submissions: {
                select: {
                    assignmentId: true;
                };
            };
        };
    }>;

    export let data: PageData;
    $: assignments = data.assignments as Array<Assignment>;

    // TODO: Věc backendu??? => Přesunout na backend validaci zda je test aktivní
    const isFinished = (assignment: Assignment) => {
        const finished =
            (assignment.started &&
                assignment.endTime != null &&
                assignment.endTime < new Date()) ||
            (assignment.submissions.length > 0 &&
                assignment.submissions.some(
                    (submission) => submission.assignmentId === assignment.id
                ));
        return finished;
    };

    $: noTests = assignments.length === 0 || !assignments.some((test) => !isFinished(test));

    // TODO: Websocket
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
    {#if noTests}
        <NoTestCard />
    {:else}
        {#each assignments as assignment}
            {#if !isFinished(assignment)}
                <AssignmentCard {assignment} />
            {/if}
        {/each}
    {/if}
</div>
