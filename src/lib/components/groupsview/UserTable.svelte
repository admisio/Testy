<script lang="ts">
    import type { Prisma } from '@prisma/client';

    export let users: Array<
        Prisma.UserGetPayload<{
            include: {
                testSubmissions: {
                    include: {
                        assignedTest: true;
                    };
                };
            };
        }>
    >;
    export let assignedTests: Array<
        Prisma.AssignedTestGetPayload<{
            include: {
                test: true;
            };
        }>
    >;
</script>

<div class="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8">
    <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
        <table class="min-w-full leading-normal">
            <thead>
                <tr>
                    <th>Uživatel</th>
                    <th>Jméno</th>
                    {#each assignedTests as assignedTest}
                        <th>{assignedTest.test.title}</th>
                    {/each}
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user}
                    <tr>
                        <td>
                            <p>{user.username}</p>
                        </td>
                        <td>
                            <p>
                                {user.name ?? 'Anonymní'}
                            </p>
                        </td>
                        {#each assignedTests as assignedTest}
                            <td>
                                {user.testSubmissions.find(
                                    (s) => s.assignedTest.id === assignedTest.id
                                )
                                    ? '✅ Odevzdáno'
                                    : '❌ Chybí'}</td
                            >
                        {/each}
                        <td>
                            <span
                                class="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900"
                            >
                                {#if user.testSubmissions.length === assignedTests.length}
                                    <span
                                        aria-hidden
                                        class="absolute inset-0 rounded-full bg-green-200 opacity-50"
                                    />
                                    <span class="relative">Vše odevdzáno</span>
                                {:else}
                                    ❌
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
