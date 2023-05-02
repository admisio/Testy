<script lang="ts">
    import { enhance } from '$app/forms';

    import 'highlight.js/styles/github.css';

    import type { ActionData } from './$types';

    import TestPreview from '$lib/components/testpreview/TestPreview.svelte';

    export let form: ActionData;
</script>

<form method="POST" use:enhance>
    <input type="file" name="file" id="file" multiple />
    <input type="submit" value="Nahrát test" />
</form>

{#if form && form.success && form.template}
    <TestPreview test={form.template} />
{/if}
