<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import { trpc } from '$lib/trpc/client';
    import type { PageData } from './$types';

    export let data: PageData;

    const createGroup = async () => {
        await trpc().groups.create.mutate({ name: 'Nova skupina', users: [] });
        invalidateAll();
    };

    import Icon from '@iconify/svelte';
    import Button from '$lib/components/buttons/Button.svelte';

    const a = [...data.groups];
    a.pop();
</script>

<div class="w-9/10 mx-auto mb-6 flex items-center <md:flex-col">
    <h1 class="text-6xl font-bold text-[#3580b7] <md:mb-3">Skupiny</h1>
    <div class="mt-2">
        <Button icon="material-symbols:add-circle-outline-rounded" title="Vytvořit skupinu" />
    </div>
</div>

<div class="w-9/10 <md:flex-col mx-auto flex">
    {#each a as group}
        <div
            class="<md:mb-3 mx-3 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
        >
            <span class="text-3xl">
                <Icon icon="material-symbols:group" />
            </span>
            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {group.name}
            </h5>
            <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, expedita.
            </p>
            <div class="mb-3">
                {#each [{ name: '101001' }, { name: '101001' }, { name: '101001' }, { name: '101001' }, { name: '101001' }, { name: '101001' }, { name: '101001' }] as user}
                    <span
                        class="mr-1 mb-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                    >
                        {user.name}
                    </span>
                {/each}
            </div>
            <a href="#" class="inline-flex items-center text-blue-600 hover:underline">
                Otevřit
                <span class="ml-1">
                    <Icon icon="material-symbols:open-in-new" />
                </span>
            </a>
        </div>
    {/each}
</div>
<!-- <p
    on:keydown={null}
    class="hover:cursor-pointer hover:underline"
    on:click={(_) => goto('/admin/groups/' + group.id)}
>
    {group.name}
</p> -->
<button class="font-bold" on:click={createGroup}>Přidat skupinu</button>
