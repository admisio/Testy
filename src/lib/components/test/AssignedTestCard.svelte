<script lang="ts">
    import Icon from '@iconify/svelte';
    import type { Prisma } from '@prisma/client';

    export let assignedTest: Prisma.AssignedTestGetPayload<{
        include: {
            test: true;
            submissions: {
                select: {
                    testId: true;
                };
            };
        };
    }>;

    $: testIsActive =
        assignedTest.started && assignedTest.endTime != null && assignedTest.endTime > new Date();

    $: testIsFinished =
        (assignedTest.started &&
            assignedTest.endTime != null &&
            assignedTest.endTime < new Date()) ||
        (assignedTest.submissions.length > 0 &&
            assignedTest.submissions.some(
                (submission) => submission.testId === assignedTest.testId
            ));
</script>

<div
    class="group relative mx-3 mb-6 flex-grow basis-[32%] rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
>
    <span class="text-3xl">
        <Icon icon="fluent:certificate-24-regular" />
    </span>
    <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {assignedTest.test.title}
    </h5>
    <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, expedita.
    </p>
    <div class="mb-2 flex">
        {#if testIsActive && !testIsFinished}
            <span class="pillow mr-1 mb-1 bg-green-500  text-white">Spuštěno</span>
        {:else if testIsFinished}
            <span class="pillow mr-1 mb-1 bg-gray-500 text-white">Test byl ukončen</span>
        {:else}
            <span class="pillow mr-1 mb-1 bg-gray-400 text-white">Neaktivní</span>
        {/if}
    </div>

    {#if testIsActive && !testIsFinished}
        <a
            href={`/home/test/${assignedTest.id}`}
            class="inline-flex items-center text-blue-600 hover:underline"
        >
            Otevřit
            <span class="ml-1">
                <Icon icon="material-symbols:open-in-new" />
            </span>
        </a>
    {/if}
</div>

<style lang="postcss">
    .pillow {
        @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
    }
</style>
