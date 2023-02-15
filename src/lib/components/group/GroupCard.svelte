<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Icon from '@iconify/svelte';
    import type { Prisma } from '@prisma/client';
    import { trpc } from '$lib/trpc/client';

    const dispatch = createEventDispatcher();

    export let group: Prisma.GroupGetPayload<{
        select: {
            id: true;
            name: true;
            users: {
                select: {
                    id: true;
                    username: true;
                };
            };
        };
    }>;

    let userIsBeingAdded: boolean = false;

    const listUsers = async () => {
        const users = await trpc().users.list.query();
        return users;
    };

    const addUserToGroup = async (e: Event) => {
        dispatch('addUser', {
            userId: Number((e.target as HTMLSelectElement).value),
            groupId: group.id
        });
        userIsBeingAdded = false;
    };
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
    <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {group.name}
    </h5>
    <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, expedita.
    </p>
    <div class="mb-3">
        {#each group.users as user}
            <span
                class="pillow mr-1 mb-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
            >
                {user.username}
                <button
                    on:click={() => dispatch('removeUser', { userId: user.id, groupId: group.id })}
                    class="ml-1 hidden text-lg text-red-900"
                >
                    <Icon icon="material-symbols:group-remove-outline" />
                </button>
            </span>
        {/each}
        {#if userIsBeingAdded}
            {#await listUsers() then users}
                <select on:change={addUserToGroup} value="">
                    <option value="" />
                    {#each users as user}
                        <option value={user.id}>{user.username}</option>
                    {/each}
                </select>
            {/await}
        {/if}
        <button on:click={() => (userIsBeingAdded = !userIsBeingAdded)} class="">
            {#if !userIsBeingAdded}
                <Icon icon="material-symbols:add-circle-outline-rounded" />
            {:else}
                <Icon icon="material-symbols:stop-outline" />
            {/if}
        </button>
    </div>
    <a
        href={`/admin/groups/${group.id}`}
        class="inline-flex items-center text-blue-600 hover:underline"
    >
        Otevřit
        <span class="ml-1">
            <Icon icon="material-symbols:open-in-new" />
        </span>
    </a>
</div>

<style lang="postcss">
    .pillow:hover button {
        @apply block;
    }
</style>
