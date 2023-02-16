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
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Název
                    </th>
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Čas spuštění
                    </th>
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Čas ukončení
                    </th>
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Zbývá (min)
                    </th>
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Počet odevzdání
                    </th>
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each assignedTests as assignedTest, i}
                    <tr>
                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <div class="flex items-center">
                                <p class="whitespace-no-wrap text-gray-900">
                                    {assignedTest.test.title}
                                </p>
                            </div>
                        </td>
                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p class="whitespace-no-wrap text-gray-900">
                                {formatDate(assignedTest.startTime)}
                            </p>
                        </td>
                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p class="whitespace-no-wrap text-gray-900">
                                {formatDate(assignedTest.endTime)}
                            </p>
                        </td>
                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p class="whitespace-no-wrap text-gray-900">
                                {timeRemaining[i]}
                            </p>
                        </td>
                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p class="whitespace-no-wrap text-gray-900">
                                {`${assignedTest.submissions.length}/${userCount}`}
                            </p>
                        </td>

                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
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
</style>
