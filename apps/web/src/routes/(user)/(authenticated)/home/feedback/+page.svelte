<script lang="ts">
    import { enhance } from '$app/forms';

    import Submit from '$lib/components/buttons/Submit.svelte';
    import type { ActionData } from './$types';

    export let form: ActionData;
</script>

{#if form?.success}
    <div class="my-2 w-full bg-green-600 p-4">
        <p class="text-center font-bold text-white">Děkujeme za zpětnou vazbu!</p>
    </div>
{/if}
<div class="mx-auto max-w-screen-xl">
    <form method="POST" use:enhance class="w-full p-4">
        <div>
            <label for="feedback" class="sr-only">Zpětná vazba</label>
            <textarea
                class="text-md min-h-sm w-full rounded-sm border border-gray-700 p-3"
                name="feedback"
                required
            />
        </div>
        <div class="my-4">
            <Submit title="Odeslat zpětnou vazbu" />
        </div>
    </form>
</div>
