<script lang="ts">
    import Icon from '@iconify/svelte';

    export let onEnter = false;
    let submitButton: HTMLButtonElement;

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            if (submitButton && onEnter) {
                submitButton.click();
            }
        }
    };

    export let title: string;
    export let icon: string = "";
</script>

<button on:click bind:this={submitButton}>
    <div>
        <span class="mr-1 font-bold text-white">{title}</span>
        {#if icon}
            <Icon {icon} />
        {/if}
    </div>
</button>

<svelte:window on:keydown={handleKeydown} />

<style lang="postcss">
    button {
        @apply ml-3 inline-block rounded-lg bg-[#3580b7];
        @apply px-5 py-3;
        @apply text-sm font-bold text-white no-underline;
        @apply shadow-xl shadow-sky-500/20 transition-all duration-300;
    }
    button:hover {
        @apply bg-[#3073a6];
    }
    div {
        @apply flex flex-row items-center;
    }
</style>
