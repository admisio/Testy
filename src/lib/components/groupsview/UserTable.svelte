<script lang="ts">
    import type { TestSubmission } from '@prisma/client';

    export let users: Array<{
        name: string;
        surname: string;
        testSubmissions: (TestSubmission & {
            assignedTest: {
                id: number;
            };
        })[];
    }>;
    export let assignedTests: Array<{
        id: number;
        test: { title: string };
        started: boolean;
        startTime: Date | null;
    }>;

    console.log(users[0].testSubmissions);
</script>

<table>
    <thead>
        <tr>
            <th>Jméno</th>
            <th>Příjmení</th>
            {#each assignedTests as assignedTest}
                <th>{assignedTest.test.title}</th>
            {/each}
            <th>Vše odevzdáno</th>
        </tr>
    </thead>
    <tbody>
        {#each users as user}
            <tr>
                <td>{user.name}</td>
                <td class="font-bold">{user.surname.toUpperCase()}</td>
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
        @apply border-2 border-[#1D1D1E] w-full;
    }

    th {
        @apply bg-[#1D1D1E] text-white text-xl;
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
