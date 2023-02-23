<script lang="ts">
    import type { PageData } from './$types';
    import UserTable from '$lib/components/groupsview/UserTable.svelte';
    import TestTable from '$lib/components/groupsview/TestTable.svelte';
    import { trpc } from 'trpc/client';
    import { invalidateAll } from '$app/navigation';
    import type { Prisma } from 'database';

    export let data: PageData;

    $: group = data.group;
    $: templates = data.templates ?? [];
    $: users =
        (group?.users as Array<
            Prisma.UserGetPayload<{
                include: {
                    submissions: {
                        include: {
                            assignment: true;
                        };
                    };
                };
            }>
        >) ?? [];

    $: assignments = group.assignments as Array<
        Prisma.AssignmentGetPayload<{
            include: {
                template: true;
                submissions: true;
            };
        }>
    > | undefined ?? [];

    let inputTemplateId: number;

    $: console.log(inputTemplateId);

    const assignTest = async () => {
        if (!group?.id) return;
        await trpc().assignments.assignToGroup.mutate({
            groupId: group?.id,
            templateId: inputTemplateId
        });
        invalidateAll();
    };

    const startTest = async (e: any) => {
        const assignmentId = e.detail.assignmentId;
        await trpc().assignments.start.mutate({ assignmentId });
        invalidateAll();
    };
</script>

<div class="mx-auto flex max-w-screen-xl flex-col px-4 py-3 md:px-6">
    <h1 class="text-5xl font-bold">Skupina {group?.name}</h1>
    <div class="mt-8">
        <UserTable {users} {assignments} />
    </div>
    <div class="mt-16">
        <h2 class="mb-4 text-4xl font-bold">Zadané testy</h2>
        <TestTable on:startTest={startTest} userCount={users.length} {assignments} />
    </div>
    <div>
        <select bind:value={inputTemplateId}>
            {#each templates as template}
                <option value={template.id}>{template.title}</option>
            {/each}
        </select>
        <button class="mt-2" on:click={assignTest}>
            <span class="text-white">Přiřadit test</span>
        </button>
    </div>
</div>

<style lang="postcss">
    button {
        @apply rounded-md shadow-md py-2 px-3 bg-green-700 text-gray-900;
    }
    select {
        @apply rounded-md shadow-md py-2 px-3 bg-gray-100 text-gray-900;
    }
    /* option {
        @apply 
    } */
</style>