<script lang="ts">
    import Icon from '@iconify/svelte';

    const typeAction = (node: HTMLInputElement) => {
        node.type = type;
    };
    export let icon: string;
    export let type: string = 'text';
    export let placeholder: string = '';
    export let name: string = '';
    export let required: boolean = false;
</script>

<div class="relative">
    <input {name} use:typeAction {placeholder} {required} />
    {#if icon}
        <span class="absolute inset-y-0 right-4 inline-flex items-center">
            <Icon {icon} />
        </span>
    {/if}
</div>

<style lang="postcss">
    input {
        @apply w-full rounded-lg;
        @apply border-2 border-gray-200 p-4 pr-12 text-sm;
        @apply shadow-lg transition-colors duration-300;
        @apply outline-none;
    }
    input:hover, input:focus {
        @apply border-2 border-[#3580b7];
    }
</style>
