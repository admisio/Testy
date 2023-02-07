<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { trpc } from "$lib/trpc/client";
    import type { PageData } from "./$types";

    export let data: PageData;

    const createGroup = async () => {
        await trpc().groups.create.mutate({name: "Nova skupina", users: []});
        invalidateAll();
    }
</script>

<h1 class="font-bold text-blue-700 text-6xl">Skupiny</h1>

{#each data.groups as group}
    <p class="hover:underline hover:cursor-pointer" on:click={(_) => goto('/admin/groups/' + group.id)}>{group.name}</p>
{/each}
<button class="font-bold" on:click={createGroup}>Přidat skupinu</button>

