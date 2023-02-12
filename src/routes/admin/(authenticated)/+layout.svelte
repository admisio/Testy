<script lang="ts">
    import Header from '$lib/components/Header.svelte';
</script>

<template>
    <Header isAuthenticated={true} />
    <slot />
</template>