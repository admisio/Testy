<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/buttons/Button.svelte';
    import Submit from '$lib/components/buttons/Submit.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import UserListItem from '$lib/components/userlist/UserListItem.svelte';
    import { trpc } from '$lib/trpc/client';
    import type { ActionData, PageServerData } from './$types';

    export let data: PageServerData;

    // TODO: xlsx download
    const downloadXlsx = async (e: Event) => {
        const base64 = await trpc().users.xlsx.query();
        const byteCharacters = atob(base64);

        // Create a Uint8Array
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the Uint8Array
        const blob = new Blob([byteArray], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        // download the file

        const anchor = window.document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = 'vysledky.xlsx';
        anchor.click();
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
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl items-center px-4 py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Uživatelé</h1>
    <div class="ml-3 mt-2">
        <Button
            on:click={openModal}
            icon="material-symbols:add-circle-outline-rounded"
            title="Přidat uživatele"
        />
        <Button on:click={downloadXlsx} icon="material-symbols:download" title="Stáhnout výsledky" />
    </div>
</div>
<div class="mx-auto mx-auto mb-6 flex max-w-screen-xl flex-col px-4 py-3 md:px-6 md:px-6">
    {#each data.users as user}
        <UserListItem {user} />
    {/each}
</div>

<style>
</style>
