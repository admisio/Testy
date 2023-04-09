<script lang="ts">
    import type { Prisma } from '@testy/database';

    import { trpc } from '$lib/trpc/client';
    import { invalidateAll } from '$app/navigation';

    import Icon from '@iconify/svelte';
    import { clickoutside } from '@svelte-put/clickoutside';

    export let user: Prisma.UserGetPayload<{
        select: {
            id: true;
        };
    }>;

    let isOpen = false;

    const open = () => {
        isOpen = true;
    };

    const close = () => {
        isOpen = false;
    };

    const resetPassword = async () => {
        const newPassword = await trpc().users.resetPassword.mutate({ id: user.id });
        alert(newPassword);
        close();
    };

    const deleteUser = async () => {
        // TODO: Lepší potvrzení než confirm..
        if (confirm('Opravdu chcete smazat uživatele?')) {
            await trpc().users.delete.mutate({ id: user.id });
            await invalidateAll();
            close();
        }
    };
</script>

<div use:clickoutside on:clickoutside={close} class="relative flex flex-col">
    <button on:click={open}><Icon icon="material-symbols:settings" /></button>
    {#if isOpen}
        <div class="menu absolute top-5 left-0 z-10 w-28">
            <button on:click={resetPassword} class="!rounded-b-none">Nové heslo</button>
            <button on:click={deleteUser} class="!rounded-b-none !rounded-t-none">Odstranit</button>
            <button on:click={close} class="!rounded-t-none">Zavřít</button>
        </div>
    {/if}
</div>

<style lang="postcss">
    .menu button {
        @apply w-full;
        @apply p-1 px-2;
        @apply rounded-lg border border-gray-200 bg-white shadow;
        @apply transition-colors duration-300;
    }
    .menu button:hover {
        @apply bg-gray-100;
    }
</style>
