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

<table>
    <thead>
        <tr>
            <th>Username</th>
            {#each assignedTests as assignedTest}
                <th>{assignedTest.test.title}</th>
            {/each}
            <th>Vše odevzdáno</th>
        </tr>
    </thead>
    <tbody>
        {#each users as user}
            <tr>
                <td class="font-bold">{user.username}</td>
                {#each assignedTests as assignedTest}
                    <td
                        >{user.testSubmissions.find((s) => s.assignedTest.id === assignedTest.id)
                            ? '✅ Odevzdáno'
                            : '❌ Chybí'}</td
                    >
                {/each}
                <td>
                    {user.testSubmissions.length === assignedTests.length ? '✅ ANO' : '❌ NE'}
                    <!-- {#each user.testSubmissions as testSubmission}
                    <td>{testSubmission}</td>
                {/each} -->
                </td></tr
            >
        {/each}
    </tbody>
</table>

<style lang="postcss">
    table {
        @apply w-full border-2 border-[#1D1D1E];
    }

    th {
        @apply bg-[#1D1D1E] text-xl text-white;
        @apply px-4 py-4;
        @apply border-2 border-[#1D1D1E];
    }
    td {
        @apply p-2 text-xl;
        @apply border-2 border-[#1D1D1E];
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
</style>
