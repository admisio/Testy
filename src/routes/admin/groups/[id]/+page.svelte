<script lang="ts">
    import type { PageData } from "./$types";


    export let data: PageData;
    const group = data.group;
    const users = group?.users || [];
    console.log(group);
</script>

<h1>{group?.name}</h1>
<h2>Users:</h2>
{#each users as user}
    <p>{user.name}</p>
{/each}