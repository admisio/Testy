<script lang="ts">
    import PageTransition from '$lib/components/PageTransition.svelte';

    export let data: { url: string };
</script>

<PageTransition url={data.url}>
    <template>
        <main>
            <slot />
        </main>
    </template>
</PageTransition>

<style>
</style>
