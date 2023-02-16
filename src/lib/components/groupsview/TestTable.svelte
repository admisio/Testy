<script lang="ts">
    import { formatDate, remainingTime } from '$lib/utils/date';
    import type { Prisma } from '@prisma/client';
    import { createEventDispatcher } from 'svelte';

    export let assignedTests: Array<
        Prisma.AssignedTestGetPayload<{
            include: {
                test: true;
                submissions: true;
            };
        }>
    >;

    export let userCount: number;

    let timeRemaining: string[];

    const updateTimeRemaining = () => {
        timeRemaining = assignedTests.map((assignedTest) => {
            if (assignedTest.endTime && assignedTest.endTime < new Date()) {
                return 'Test skončil';
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

<div class="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8">
    <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
        <table class="min-w-full leading-normal">
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
                        <td>
                            <p>
                                {assignedTest.test.title}
                            </p>
                        </td>
                        <td>
                            <p>
                                {formatDate(assignedTest.startTime)}
                            </p>
                        </td>
                        <td>
                            <p>
                                {formatDate(assignedTest.endTime)}
                            </p>
                        </td>
                        <td>
                            <p>
                                {timeRemaining[i]}
                            </p>
                        </td>
                        <td>
                            <p>
                                {`${assignedTest.submissions.length}/${userCount}`}
                            </p>
                        </td>

                        <td>
                            <span
                                class="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900"
                            >
                                {#if assignedTest.started && assignedTest.endTime && assignedTest.endTime > new Date()}
                                    <span
                                        aria-hidden
                                        class="absolute inset-0 rounded-full bg-green-200 opacity-50"
                                    />
                                    <span class="relative">Spuštěno</span>
                                {:else if assignedTest.endTime && assignedTest.endTime < new Date()}
                                    <span
                                        aria-hidden
                                        class="absolute inset-0 rounded-full bg-red-200 opacity-50"
                                    />
                                    <span class="relative text-red-700">Ukončeno</span>

                                {:else}
                                    <button
                                        on:click={(_) => startTest(assignedTest.id)}
                                        class="w-full text-center">Spustit</button
                                    >
                                {/if}
                            </span>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style lang="postcss">
    th {
        @apply border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600;
    }
    td {
        @apply border-b border-gray-200 bg-white px-5 py-5 text-sm;
    }
    td p {
        @apply whitespace-nowrap text-gray-900;
    }
</style>
