<script lang="ts">
    import Icon from '@iconify/svelte';
    import type { Prisma } from '@testy/database';

    export let assignment: Prisma.AssignmentGetPayload<{
        include: {
            template: true;
            submissions: {
                select: {
                    assignmentId: true;
                };
            };
        };
    }>;

    $: testIsActive =
        assignment.started && assignment.endTime != null && assignment.endTime > new Date();

    $: testIsSubmited =
        assignment.submissions.length > 0 &&
        assignment.submissions.some((submission) => submission.assignmentId === assignment.id);

    $: testIsFinished =
        (assignment.started &&
            assignment.endTime != null &&
            assignment.endTime < new Date()) ||
        testIsSubmited;
</script>

<div
    class="group relative mx-3 mb-6 flex-grow basis-[32%] rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
>
    <span class="text-3xl">
        <Icon icon="fluent:certificate-24-regular" />
    </span>
    <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {assignment.template.title}
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
            href={`/home/test/${assignment.id}`}
            class="inline-flex items-center text-blue-600 hover:underline"
        >
            Otevřit
            <span class="ml-1">
                <Icon icon="material-symbols:open-in-new" />
            </span>
        </a>
    {:else if assignment.started && testIsSubmited}
        <a
            href={`/home/test/${assignment.id}/result`}
            class="inline-flex items-center text-blue-600 hover:underline"
        >
            Zobrazit výsledky
            <span class="ml-1">
                <Icon icon="material-symbols:open-in-new" />
            </span>
        </a>
    {:else}
        <span class="inline-flex items-center text-gray-600"> Neodevzdáno </span>
    {/if}
</div>

<style lang="postcss">
    .pillow {
        @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
    }
</style>
