<script lang="ts">
    import Icon from '@iconify/svelte';
</script>

<button type="submit">
    <div>
        <span class="mr-1 font-bold text-white">Přihlásit se</span>
        <Icon icon="material-symbols:arrow-forward-rounded" />
    </div>
</button>

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
