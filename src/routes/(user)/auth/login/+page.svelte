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

    import SchoolBadge from '$lib/components/icons/SchoolBadge.svelte';
    import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
    import Submit from '$lib/components/buttons/Submit.svelte';
    import UsernameInput from '$lib/components/inputs/UsernameInput.svelte';
</script>

<div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto  text-center">
        <div class="mx-auto mb-6 h-32 w-32">
            <SchoolBadge />
        </div>

        <h1
            class="whitespace-pre-wrap text-center text-2xl font-extrabold leading-tight tracking-tight md:text-3xl lg:text-4xl xl:text-5xl"
        >
            Digitální přijímací testy <br />Pracujeme s online daty, ne papíry!
        </h1>
        <p
            class="mx-auto max-w-[60ch] pt-3 text-center text-sm font-medium text-zinc-600 dark:text-zinc-300 md:text-lg"
        >
            Přihlašte se ke svému účtu pro vyplnění
            <span
                class="text-slate-900 underline decoration-blue-400 decoration-wavy decoration-from-font underline-offset-2 dark:text-slate-100"
                >plně digitálních</span
            >
            <!-- -->testů <br /> v rámci Vašeho přijímacího řízení.
        </p>
    </div>

    <form method="POST" use:enhance class="mx-auto mt-8 mb-0 max-w-md space-y-4">
        <div>
            <label for="username" class="sr-only">Ev. číslo</label>

            <UsernameInput required placeholder={'Ev. číslo'} />
        </div>

        <div>
            <label for="password" class="sr-only">Heslo</label>
            <PasswordInput required />
        </div>

        <div class="flex w-full items-center justify-center">
            <Submit />
        </div>
    </form>
</div>
