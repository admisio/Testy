<script lang="ts">
    import Button from '$lib/components/buttons/Button.svelte';
    import { trpc } from '$lib/trpc/client';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    const addUser = async () => {
        console.log('addUser');
    };

    const downloadCsv = async () => {
        const csv = await trpc().users.csv.query();
        const blob = new Blob([csv], { type: 'text/csv' });
        // download the file
        const anchor = window.document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = "users.csv";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(anchor.href);
    };
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4  py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Uživatelé</h1>
    <div class="ml-3 mt-2">
        <Button
            on:click={addUser}
            icon="material-symbols:add-circle-outline-rounded"
            title="Přidat uživatele"
        />
        <Button
            on:click={downloadCsv}
            icon="material-symbols:download"
            title="Stáhnout CSV"
        />
    </div>
</div>
<div class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl px-4  py-3 md:px-6 md:px-6">
    {#each data.users as user}
        <div class="flex">
            {user.id}

            {user.name}

            {user.email}
        </div>
    {/each}
</div>

<style>
</style>
