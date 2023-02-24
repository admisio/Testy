<script lang="ts">
    import AssignmentCard from '$lib/components/test/AssignmentCard.svelte';
    import type { Prisma } from '@testy/database';
    import type { PageData } from './$types';

    export let data: PageData;
    const assignments = data.assignments as Prisma.AssignmentGetPayload<{
        include: {
            template: true;
            submissions: {
                select: {
                    assignmentId: true;
                };
            };
        };
    }>[];
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4  py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Testy</h1>
</div>
<div     class="<md:flex-col mx-auto mx-auto flex max-w-screen-xl flex-wrap justify-between px-4 py-3 md:px-6"
>
    
    {#each assignments as assignment}
        <AssignmentCard {assignment} />
    {/each}
</div>
