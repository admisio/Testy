<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { trpc } from "$lib/trpc/client";
import type { PageData } from "./$types";

    export let data: PageData;

    const createGroup = async () => {
        await trpc().groups.create.mutate({name: "Nova skupina", users: []});
        invalidateAll();
    }
</script>

<h1>Skupiny</h1>

{#each data.groups as group, i}
    <p>{group.name}</p>
{/each}
<button on:click={createGroup} >Přidat skupinu</button>

