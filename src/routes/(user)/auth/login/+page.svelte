<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import type { ActionData } from './$types';
    export let form: ActionData;
    let error = false;
    $: returnTo = $page.url.searchParams.get('returnTo');
    $: (async () => {
        if (form?.success) {
            await invalidateAll();
            await goto(returnTo || '/home/test');
        } else if (form?.incorrect) {
            error = true;
        }
    })();
    const clearError = () => {
        error = false;
    };
</script>

<svelte:head>
    <title>Login • Bookstall</title>
</svelte:head>
<form method="POST" use:enhance>
    <article>
        <header>Login</header>
        <label>
            Username
            <input name="username" type="username" required class="border-4" />
        </label>
        <label>
            Password
            <input name="password" type="password" required class="border-4" />
        </label>
        <footer>
            {#if returnTo}
                <a role="button" class="secondary" href={returnTo}>Cancel</a>
            {/if}
            <button type="submit">Login</button>
        </footer>
    </article>
</form>
<dialog open={!!error}>
    <article>
        <header>Authentication failed!</header>
        <p>Please check your credentials and try again.</p>
        <footer>
            <button class="secondary" on:click={clearError}>Ok</button>
        </footer>
    </article>
</dialog>

<style>
    form {
        max-width: 500px;
        margin: var(--block-spacing-vertical) auto;
    }
</style>
