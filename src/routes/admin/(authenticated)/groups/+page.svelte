<script async script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { trpc } from '$lib/trpc/client';
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
</script>

<div class="w-9/10 <md:flex-col mx-auto mb-6 flex items-center">
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Skupiny</h1>
    <div class="mt-2">
        <Button
            on:click={createGroup}
            icon="material-symbols:add-circle-outline-rounded"
            title="Vytvořit skupinu"
        />
    </div>
</div>

<div class="w-9/10 <md:flex-col mx-auto flex flex-wrap justify-between">
    {#each data.groups as group}
        <GroupCard
            {group}
            on:delete={() => deleteGroup(group.id)}
            on:addUser={(e) => addUserToGroup(e.detail.userId, e.detail.groupId)}
            on:removeUser={(e) => removeUserFromGroup(e.detail.userId, e.detail.groupId)}
        />
    {/each}
</div>
