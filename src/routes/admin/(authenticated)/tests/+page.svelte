<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";


    export let data: PageData;

</script>

<h1 class="font-bold text-6xl">Testy</h1>
{#each data.tests as test, i}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p on:click={(_) => goto('/admin/tests/' + i)} class="hover:cursor-pointer text-red-700">{test.title}</p>
{/each}