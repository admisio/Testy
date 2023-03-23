<script lang="ts">
    import { formatDate, remainingTime } from '$lib/utils/date';
    import type { Prisma } from '@testy/database';
    import { createEventDispatcher } from 'svelte';

    export let assignments: Array<
        Prisma.AssignmentGetPayload<{
            include: {
                template: true;
                submissions: true;
            };
        }>
    >;

    export let userCount: number;

    let timeRemaining: string[];

    const updateTimeRemaining = () => {
        timeRemaining = assignments.map((assignment) => {
            if (assignment.endTime && assignment.endTime < new Date()) {
                return 'Test skončil';
            } else {
                const remaining = remainingTime(assignment.endTime);
                return remaining ? remaining : '-';
            }
        });
    };

    updateTimeRemaining();
    setInterval(() => updateTimeRemaining(), 1000);

    const dispatch = createEventDispatcher();

    const startTest = (assignmentId: number) => {
        dispatch('startTest', {
            assignmentId
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
                {#each assignments as assignment, i}
                    <tr>
                        <td>
                            <p>
                                {assignment.template.title}
                            </p>
                        </td>
                        <td>
                            <p>
                                {#if assignment.startTime}
                                    {formatDate(assignment.startTime)}
                                {:else}
                                    -
                                {/if}
                            </p>
                        </td>
                        <td>
                            <p>
                                {#if assignment.endTime}
                                    {formatDate(assignment.endTime)}
                                {:else}
                                    -
                                {/if}
                            </p>
                        </td>
                        <td>
                            <p>
                                {timeRemaining[i]}
                            </p>
                        </td>
                        <td>
                            <p>
                                {`${assignment.submissions.length}/${userCount}`}
                            </p>
                        </td>

                        <td>
                            <span
                                class="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900"
                            >
                                {#if assignment.started && assignment.endTime && assignment.endTime > new Date()}
                                    <span
                                        aria-hidden
                                        class="absolute inset-0 rounded-full bg-green-200 opacity-50"
                                    />
                                    <span class="relative">Spuštěno</span>
                                {:else if assignment.endTime && assignment.endTime < new Date()}
                                    <span
                                        aria-hidden
                                        class="absolute inset-0 rounded-full bg-red-200 opacity-50"
                                    />
                                    <span class="relative text-red-700">Ukončeno</span>
                                {:else}
                                    <button
                                        on:click={(_) => startTest(assignment.id)}
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
        @apply border-b border-gray-200 bg-white px-5 py-5 text-lg;
    }
    td p {
        @apply whitespace-nowrap text-gray-900;
    }
</style>
