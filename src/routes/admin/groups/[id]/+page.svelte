<script lang="ts">
    import { invalidate, invalidateAll } from '$app/navigation';
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';

    export let data: PageData;
    const group = data.group;
    const users = group?.users || [];
    const assignedTests = group?.assignedTests || [];
    console.log(group);

    const assignTest = async () => {
        await trpc().assignedTests.assignToGroup.mutate({ groupId: group?.id!, templateId: 47 });
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

<button on:click={assignTest}>Assign test</button>
