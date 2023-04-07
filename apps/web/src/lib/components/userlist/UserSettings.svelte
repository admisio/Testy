<script lang="ts">
    import Icon from '@iconify/svelte';

    import { clickoutside } from '@svelte-put/clickoutside';

    let isOpen = false;

    const open = () => {
        isOpen = true;
    };

    const close = () => {
        isOpen = false;
    };
</script>

<div use:clickoutside on:clickoutside={close} class="relative flex flex-col">
    <button on:click={open}><Icon icon="material-symbols:settings" /></button>
    {#if isOpen}
        <div class="menu absolute top-5 left-0 z-10 w-28">
            <button class="!rounded-b-none">Nové heslo</button>
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
