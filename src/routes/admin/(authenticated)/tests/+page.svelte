<script lang="ts">
    import { trpc } from '$lib/trpc/client';
    import Button from '$lib/components/buttons/Button.svelte';
    import TextInput from '$lib/components/inputs/TextInput.svelte';
    import Modal from '$lib/components/Modal.svelte';

    import { enhance } from '$app/forms';

    import type { ActionData, PageData } from './$types';
    import Submit from '$lib/components/buttons/Submit.svelte';
    import TestCard from '$lib/components/test/TestCard.svelte';
    import { invalidateAll } from '$app/navigation';

    export let data: PageData;

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

    const deleteTest = async (id: number) => {
        await trpc().tests.delete.mutate(id);
        invalidateAll();
    };

    const renameTest = async (newName: string, id: number) => {
        await trpc().tests.rename.mutate({ title: newName, id });
    };
</script>

{#if isModalOpen}
    <Modal on:close={closeModal}>
        <div class="min-w-screen-lg p-14">
            <form method="POST" use:enhance>
                <h1 class="my-6 text-4xl font-bold text-[#3580b7]">Vytvořit test</h1>
                <TextInput name="timeLimit" type="number" placeholder="Časový limit (minuty)" />
                <div
                    class="my-6 h-48 p-6"
                    style={`background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' rx='9' ry='9'  stroke-opacity='50%' stroke='%23406280' stroke-width='4' stroke-dasharray='10' stroke-dashoffset='${0}' stroke-linecap='square'/%3e%3c/svg%3e");`}
                >
                    <span>TODO: Drag & Drop</span>
                    <input type="file" name="file" id="file" multiple />
                </div>
                <Submit title="Nahrát test" />
            </form>
        </div>
    </Modal>
{/if}

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4 px-4 py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Testy</h1>
    <div class="ml-3 mt-2">
        <Button
            on:click={openModal}
            icon="material-symbols:add-circle-outline-rounded"
            title="Přidat test"
        />
    </div>
</div>

<div
    class="<md:flex-col mx-auto mx-auto flex max-w-screen-xl flex-wrap justify-between px-4 py-3 md:px-6"
>
    {#each data.tests as test}
        <TestCard
            {test}
            on:delete={() => deleteTest(test.id)}
            on:rename={(event) => {
                renameTest(event.detail.value, test.id);
            }}
        />
    {/each}
</div>
