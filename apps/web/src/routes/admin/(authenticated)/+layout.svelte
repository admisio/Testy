<script lang="ts">
    import AdminHeader from '$lib/components/AdminHeader.svelte';
    import PageTransition from '$lib/components/PageTransition.svelte';

    export let data: { url: string };
</script>

<template>
    <AdminHeader />
    <PageTransition url={data.url}>
        <main class="my-6">
            <slot />
        </main>
    </PageTransition>
</template>
