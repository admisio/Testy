<script lang="ts">
    import Icon, { loadIcons } from '@iconify/svelte';
    import { onMount } from 'svelte';

    // TODO: Global state
    export let isDarkMode: boolean = false;

    onMount(() => {
        loadIcons(['ic:outline-dark-mode', 'ic:outline-light-mode']);
    });
</script>

<button on:click|stopPropagation={() => (isDarkMode = !isDarkMode)}>
    {#if isDarkMode}
        <Icon icon="ic:outline-dark-mode" />
    {:else}
        <Icon icon="ic:outline-light-mode" />
    {/if}
</button>

<style lang="postcss">
    button {
        @apply text-xl p-4;
    }
</style>
