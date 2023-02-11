<script lang="ts">
    import { invalidate, invalidateAll } from '$app/navigation';
    import { trpc } from '$lib/trpc/client';
    import { formatDate } from '$lib/trpc/utils/date';
    import type { PageData } from './$types';

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

    const startTest = async (assignedTestId: number) => {
        await trpc().assignedTests.start.mutate({ assignedTestId });
        invalidateAll();
    };
</script>

<h1>Skupina: {group?.name}</h1>
<h2>Uchazeči:</h2>
{#each users as user}
    <div>
        <span>{user.name}</span>
        <span class="font-bold">{user.surname}</span>
        <span>{user.email}</span>
        <span
            >{user.testSubmissions.map(
                (s) => assignedTests.find((t) => t.id === s.testId).test.title
            )}</span
        >
    </div>
{/each}
<h2>Testy:</h2>
{#each assignedTests as assignedTest}
    <div class="flex">
        <h3 class="font-bold text-4xl mt-8">{assignedTest.test.title}</h3>
        {#if assignedTest.started && assignedTest.startTime}
            <div class="flex flex-col mt-8">
                <span
                    >Test spusten: {formatDate(assignedTest.startTime)} - {formatDate(
                        assignedTest.endTime
                    )}</span
                >
                <span>Počet odevzdání: {assignedTest.testSubmission.length}</span>

                <span class="font-bold">Odevzdali:</span>
                <ol>
                    {#each assignedTest.testSubmission as submission}
                        <li>{submission.user.name} <span>{submission.user.surname}</span></li>
                    {/each}
                </ol>
            </div>
        {:else}
            <button on:click={(_) => startTest(assignedTest.id)}>Spustit</button>
        {/if}
    </div>
{/each}

<select bind:value={inputTemplateId}>
    {#each templates as template}
        <option value={template.id}>{template.title}</option>
    {/each}
</select>
<button on:click={assignTest}>Assign test</button>
