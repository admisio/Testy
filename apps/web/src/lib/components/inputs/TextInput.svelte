<script lang="ts">
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';

    const typeAction = (node: HTMLInputElement, type: string) => {
        node.type = type;
        return {
            update(newType: string) {
                node.type = newType;
            }
        };
    };

    const focusAction = (node: HTMLInputElement) => {
        if (!focus) return;
        node.focus();
    };

    export let icon: string = '';
    export let type: string = 'text';
    export let placeholder: string = '';
    export let name: string = '';
    export let required: boolean = false;
    export let focus: boolean = false;
    export let error: boolean = false;

    const dispatch = createEventDispatcher();
</script>

<div class="relative">
    <input class:error {name} use:typeAction={type} use:focusAction {placeholder} {required} />
    {#if icon}
        <span class="absolute inset-y-0 right-4 inline-flex items-center">
            <button
                on:click|preventDefault={() => {
                    dispatch('icon-click');
                }}
            >
                <Icon {icon} />
            </button>
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
    input:hover,
    input:focus {
        @apply border-2 border-[#3580b7];
    }
    button {
        @apply p-1;
    }
    .error {
        @apply border-2 border-red-700;
    }
</style>
