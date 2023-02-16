<script lang="ts">
    import type { PageData } from './$types';
    import UserTable from '$lib/components/groupsview/UserTable.svelte';
    import TestTable from '$lib/components/groupsview/TestTable.svelte';
    import { trpc } from '$lib/trpc/client';
    import { invalidateAll } from '$app/navigation';

    export let data: PageData;

    $: group = data.group;
    $: templates = data.templates ?? [];
    $: users = group?.users ?? [];
    $: assignedTests = group?.assignedTests ?? [];

    let inputTemplateId: number;

    $: console.log(inputTemplateId);

    const assignTest = async () => {
        await trpc().assignedTests.assignToGroup.mutate({
            groupId: group?.id!,
            templateId: inputTemplateId
        });
        invalidateAll();
    };

    const startTest = async (e: any) => {
        const assignedTestId = e.detail.assignedTestId;
        await trpc().assignedTests.start.mutate({ assignedTestId });
        invalidateAll();
    };
</script>

<div class="mx-auto flex max-w-screen-xl flex-col px-4 py-3 md:px-6">
    <h1 class="text-5xl font-bold">Skupina {group?.name}</h1>
    <div class="mt-8">
        <UserTable {users} {assignedTests} />
    </div>
    <div class="mt-16">
        <h2 class="mb-4 text-4xl font-bold">Zadané testy</h2>
        <TestTable on:startTest={startTest} userCount={users.length} {assignedTests} />
    </div>
    <div>
        <select bind:value={inputTemplateId}>
            {#each templates as template}
                <option value={template.id}>{template.title}</option>
            {/each}
        </select>
        <button on:click={assignTest}>Assign test</button>
    </div>
</div>
