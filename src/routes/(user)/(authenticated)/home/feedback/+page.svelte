<script lang="ts">
    import { enhance } from '$app/forms';

    import Submit from '$lib/components/buttons/Submit.svelte';
</script>

<div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <form method="POST" use:enhance class="mx-auto mt-8 mb-0 max-w-md space-y-4">
        <div>
            <label for="feedback" class="sr-only">Zpětná vazba</label>
            <textarea name="feedback" required />
        </div>

        <div class="flex w-full items-center justify-center">
            <Submit />
        </div>
    </form>
</div>
