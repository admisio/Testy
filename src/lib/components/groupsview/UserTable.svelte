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
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Uživatel
                    </th>
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Jméno
                    </th>
                    {#each assignedTests as assignedTest}
                        <th
                            class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                            >Status ({assignedTest.test.title})</th
                        >
                    {/each}
                    {#each assignedTests as assignedTest}
                        <th
                            class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                            >Body ({assignedTest.test.title})</th
                        >
                    {/each}
                    <th
                        class="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each users as user}
                    <tr>
                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <div class="flex items-center">
                                <p class="whitespace-no-wrap text-gray-900">{user.username}</p>
                            </div>
                        </td>
                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p class="whitespace-no-wrap text-gray-900">
                                {user.name + ' ' + user.surname ?? 'Anonymní'}
                            </p>
                        </td>
                        {#each assignedTests as assignedTest}
                            <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                {user.testSubmissions.find(
                                    (s) => s.assignedTest.id === assignedTest.id
                                )
                                    ? '✅ Odevzdáno'
                                    : '❌ Chybí'}</td
                            >
                        {/each}
                        {#each assignedTests as assignedTest}
                            <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                {user.testSubmissions.find(
                                    (s) => s.assignedTest.id === assignedTest.id
                                )
                                    ? user.testSubmissions.find(
                                          (s) => s.assignedTest.id === assignedTest.id
                                      )?.evaluation
                                    : '❌ Chybí'}</td
                            >
                        {/each}
                        <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
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
</style>
