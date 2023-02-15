<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Icon from '@iconify/svelte';
    import type { Prisma } from '@prisma/client';

    const dispatch = createEventDispatcher();

    export let assignedTest: Prisma.AssignedTestGetPayload<{
        include: {
            test: true;
        };
    }>;
</script>

<div
    class="group relative mx-3 mb-6 flex-grow basis-[32%] rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
>
    <button
        class="absolute top-2 right-2 hidden text-xl group-hover:block"
        on:click={() => dispatch('delete')}
    >
        <Icon icon="material-symbols:delete-outline-sharp" />
    </button>
    <span class="text-3xl">
        <Icon icon="material-symbols:group" />
    </span>
    <h5
        contenteditable
        class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white"
    >
        {assignedTest.test.title}
    </h5>
    <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, expedita.
    </p>
    <div>
        <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Přiděleno:
        </span>
        <span class="ml-1 text-sm font-semibold text-gray-900 dark:text-white">
            {assignedTest.startTime}
        </span>
    </div>

    <a
        href={`/home/test/${assignedTest.id}`}
        class="inline-flex items-center text-blue-600 hover:underline"
    >
        Otevřit
        <span class="ml-1">
            <Icon icon="material-symbols:open-in-new" />
        </span>
    </a>
</div>

<style lang="postcss">
</style>
