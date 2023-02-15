<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import PageTransition from '$lib/components/PageTransition.svelte';

    export let data: { url: string };
</script>

<template>
    <Header />
    <PageTransition url={data.url}>
        <main class="my-6">
            <slot />
        </main>
    </PageTransition>
</template>
