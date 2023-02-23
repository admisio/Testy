<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/buttons/Button.svelte';
    import Submit from '$lib/components/buttons/Submit.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import { trpc } from 'trpc/client';
    import type { ActionData, PageServerData } from './$types';

    export let data: PageServerData;

    const downloadCsv = async () => {
        const csv = await trpc().users.csv.query();
        const blob = new Blob([csv], { type: 'text/csv' });
        // download the file
        const anchor = window.document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = 'users.csv';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(anchor.href);
    };

    const openModal = async () => {
        isModalOpen = true;
    };

    const closeModal = async () => {
        isModalOpen = false;
    };

    let isModalOpen = false;

    export let form: ActionData;

    $: (async () => {
        if (form?.success) {
            closeModal();
        }
    })();
</script>

{#if isModalOpen}
    <Modal on:close={closeModal}>
        <div class="md:min-w-screen-lg p-3 md:p-14">
            <form method="POST" use:enhance>
                <h1 class="my-6 text-center text-4xl font-bold text-[#3580b7]">
                    Vytvořit uživatele
                </h1>
                <div class="my-4">
                    <TextInput name="username" type="text" placeholder="Username" />
                </div>
                <TextInput name="password" type="text" placeholder="Heslo" />
                <div class="my-4">
                    <TextInput name="name" type="text" placeholder="Jméno" />
                </div>
                <TextInput name="surname" type="text" placeholder="Příjmení" />

                <div class="my-4">
                    <Submit title="Vytvořit uživatele" />
                </div>
            </form>
        </div>
    </Modal>
{/if}

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4  py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Uživatelé</h1>
    <div class="ml-3 mt-2">
        <Button
            on:click={openModal}
            icon="material-symbols:add-circle-outline-rounded"
            title="Přidat uživatele"
        />
        <Button on:click={downloadCsv} icon="material-symbols:download" title="Stáhnout CSV" />
    </div>
</div>
<div class="mx-auto mx-auto mb-6 flex max-w-screen-xl flex-col px-4  py-3 md:px-6 md:px-6">
    {#each data.users as user}
        <div class="mb-2 flex w-full rounded-md bg-gray-400 p-2">
            {user.id}

            {user.username}

            {user.name}

            {user.email}
        </div>
    {/each}
</div>

<style>
</style>
