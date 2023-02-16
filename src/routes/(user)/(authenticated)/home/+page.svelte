<script lang="ts">
    import AssignedTestCard from '$lib/components/test/AssignedTestCard.svelte';
    import type { Prisma } from '@prisma/client';
    import type { PageData } from './test/$types';

    export let data: PageData;
    const assignedTests = data.assignedTests as Prisma.AssignedTestGetPayload<{
        include: {
            test: true;
            submissions: {
                select: {
                    testId: true;
                };
            };
        };
    }>[];
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4  py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Přidělené testy</h1>
</div>
<div class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl px-4  py-3 md:px-6 md:px-6">
    {#each assignedTests as test}
        <AssignedTestCard assignedTest={test} />
    {/each}
</div>
