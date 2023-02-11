<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { trpc } from '$lib/trpc/client';
    import { formatDate } from '$lib/trpc/utils/date';
    import type { PageData } from './$types';
    import UserTable from '$lib/components/groupsview/UserTable.svelte';
    import TestTable from '$lib/components/groupsview/TestTable.svelte';

    export let data: PageData;
    const group = data.group;
    const templates = data.templates || [];
    const users = group?.users || [];
    const assignedTests = group?.assignedTests || [];
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

<h1 class="text-5xl font-bold">Skupina {group?.name}</h1>
<div class="mt-8">
    <UserTable {users} {assignedTests} />
</div>
<div class="mt-16">
    <h2 class="font-bold text-4xl mb-4">Zadané testy</h2>
    <TestTable on:startTest={startTest} {assignedTests} />
</div>

<select bind:value={inputTemplateId}>
    {#each templates as template}
        <option value={template.id}>{template.title}</option>
    {/each}
</select>
<button on:click={assignTest}>Assign test</button>
