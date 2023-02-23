<script async script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { trpc } from 'trpc/client';
    import type { PageData } from './$types';

    import Button from '$lib/components/buttons/Button.svelte';
    import GroupCard from '$lib/components/group/GroupCard.svelte';

    export let data: PageData;

    const createGroup = async () => {
        await trpc().groups.create.mutate({ name: 'Nova skupina', users: [] });
        invalidateAll();
    };

    const deleteGroup = async (groupId: number) => {
        await trpc().groups.delete.mutate(groupId);
        invalidateAll();
    };

    const addUserToGroup = async (userId: number, groupId: number) => {
        await trpc().groups.addUser.mutate({ userId, groupId });
        invalidateAll();
    };

    const removeUserFromGroup = async (userId: number, groupId: number) => {
        await trpc().groups.removeUser.mutate({ userId, groupId });
        invalidateAll();
    };

    const renameGroup = async (newName: string, groupId: number) => {
        await trpc().groups.rename.mutate({ name: newName, groupId });
    };
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4 px-4 py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Skupiny</h1>
    <div class="ml-3 mt-2">
        <Button
            on:click={createGroup}
            icon="material-symbols:add-circle-outline-rounded"
            title="Vytvořit skupinu"
        />
    </div>
</div>

<div
    class="<md:flex-col mx-auto mx-auto flex max-w-screen-xl flex-wrap justify-between px-4 py-3 md:px-6"
>
    {#each data.groups as group}
        <GroupCard
            {group}
            on:delete={() => deleteGroup(group.id)}
            on:addUser={(e) => addUserToGroup(e.detail.userId, e.detail.groupId)}
            on:removeUser={(e) => removeUserFromGroup(e.detail.userId, e.detail.groupId)}
            on:rename={(e) => renameGroup(e.detail.value, group.id)}
        />
    {/each}
</div>
