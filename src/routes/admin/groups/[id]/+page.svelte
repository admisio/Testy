<script lang="ts">
    import { invalidate, invalidateAll } from '$app/navigation';
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';

    export let data: PageData;
    const group = data.group;
    const templates = data.templates || [];
    const users = group?.users || [];
    const assignedTests = group?.assignedTests || [];

    let inputTemplateId: number;

    $: console.log(inputTemplateId);
    

    const assignTest = async () => {
        await trpc().assignedTests.assignToGroup.mutate({ groupId: group?.id!, templateId: inputTemplateId });
        invalidateAll();
    };

    const startTest = async (assignedTestId: number) => {
        await trpc().assignedTests.start.mutate({ assignedTestId });
        invalidateAll();
    };
</script>

<h1>{group?.name}</h1>
<h2>Users:</h2>
{#each users as user}
    <h3 class="font-bold text-4xl mt-8">{user.name}</h3>
    <ul>
        <li>{user.surname}</li>
        <li>{user.email}</li>
    </ul>
{/each}
<h2>Tests:</h2>
{#each assignedTests as assignedTest}
    <div class="flex">
        <h3 class="font-bold text-4xl mt-8">{assignedTest.test.title}</h3>
        <button on:click={(_) => startTest(assignedTest.id)}>Spustit</button>
    </div>
{/each}

<select bind:value={inputTemplateId}>
    {#each templates as template}
        <option value={template.id}>{template.title}</option>
    {/each}
</select>
<button on:click={assignTest}>Assign test</button>
