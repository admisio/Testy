<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import type { LayoutData } from './$types';
    import 'virtual:windi.css';

    export let data: LayoutData;
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600&display=swap"
    rel="stylesheet"
/>

<template>
    <main class="container">
        <slot />
    </main>
</template>

<style windi:preflights:global windi:safelist:global>
    :global(html) {
        /* font-family: 'Poppins', sans-serif; */
        background-color: #111;
        color: #e3e3e3;
    }
</style>
