<script lang="ts">
    import trpcLogoSrc from '$lib/assets/trpc-logo.png';
</script>

<svelte:head>
    <title>A tRPC-SvelteKit example application • Testy</title>
</svelte:head>

<div class="root">
    <p class="emoji">😎</p>
    <p>
        <b>TRPC JE FANCY</b>
        <br/>
        <a href="https://github.com/icflorescu/trpc-sveltekit" target="_blank" rel="noreferrer"
            >trpc-sveltekit</a
        >.
        <br />
        No REST API routes are being used white you're managing books, authors and stores — all data
        is transferred through:
        <br />
        <a class="trpc-logo" href="https://trpc.io" target="_blank" rel="noreferrer">
            <img src={trpcLogoSrc} alt="tRPC" />
            <br />
            tRPC
        </a>
    </p>
</div>

<style>
    .root {
        text-align: center;
    }

    .emoji {
        font-size: 6rem;
    }

    .trpc-logo {
        display: inline-block;
        padding: 0.7em 1em 0.5em;
        border-radius: var(--border-radius);
        margin-top: 1em;
        text-decoration: none;
    }
</style>
