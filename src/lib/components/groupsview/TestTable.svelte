<script lang="ts">
    import { formatDate, formatTime, remainingTime } from '$lib/trpc/utils/date';
    import type { TestSubmission } from '@prisma/client';
    import { createEventDispatcher } from 'svelte';

    export let assignedTests: Array<{
        id: number;
        test: { title: string };
        started: boolean;
        startTime: Date | null;
        endTime: Date | null;
        testSubmission: (TestSubmission & {
            user: {
                id: number;
                name: string;
                surname: string;
            };
        })[];
    }>;

    export let userCount: number;

    let timeRemaining: string[];

    const updateTimeRemaining = () => {
        timeRemaining = assignedTests.map((assignedTest) => {
            if (assignedTest.endTime && assignedTest.endTime < new Date()) {
                return 'Test škončil';
            } else {
                const remaining = remainingTime(assignedTest.endTime);
                return remaining ? remaining : '-';
            }
        });
    };

    updateTimeRemaining();
    setInterval(() => updateTimeRemaining(), 1000);

    const dispatch = createEventDispatcher();

    const startTest = (assignedTestId: number) => {
        dispatch('startTest', {
            assignedTestId
        });
    };
</script>

<table>
    <thead>
        <tr>
            <th>Název</th>
            <th>Čas spuštění</th>
            <th>Čas ukončení</th>
            <th>Zbývá (min)</th>
            <th>Počet odevzdání</th>
            <th>Spuštěn</th>
        </tr>
    </thead>
    <tbody>
        {#each assignedTests as assignedTest, i}
            <tr>
                <td>{assignedTest.test.title}</td>
                <td>{formatDate(assignedTest.startTime)}</td>
                <td>{formatDate(assignedTest.endTime)}</td>
                <td>{timeRemaining[i]}</td>
                <td>{`${assignedTest.testSubmission.length}/${userCount}`}</td>
                <td
                    >{assignedTest.started ? '✅ Ano' : '❌ Ne'}
                    {#if !assignedTest.started}
                        <button
                            on:click={(_) => startTest(assignedTest.id)}
                            class="text-center w-full">Spustit</button
                        >
                    {/if}
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style lang="postcss">
    table {
        @apply border-2 border-[#1D1D1E] w-full;
    }

    th {
        @apply bg-[#1D1D1E] text-white text-xl
        @apply px-4 py-4
        @apply border-2 border-[#1D1D1E];
    }
    td {
        @apply p-2 text-xl
        @apply border-2 border-[#1D1D1E];
        @apply bg-[#111111];
    }
    button {
        @apply bg-green-700 text-white text-xl rounded-md;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
</style>
