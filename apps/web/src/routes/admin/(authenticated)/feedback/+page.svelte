<script lang="ts">
    import { formatDate } from '$lib/utils/date';
    import type { PageServerData } from './$types';

    export let data: PageServerData;
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl items-center px-4 py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Zpětná vazba</h1>
</div>
<div class="mx-auto mx-auto mb-6 flex max-w-screen-xl flex-col px-4 py-3 md:px-6 md:px-6">
    {#each data.feedback as user}
        <div class="mb-2 w-full rounded-md bg-gray-300 p-2">
            <span class="rounded-md bg-white p-1">
                {formatDate(user.createdAt)}
            </span>

            {user.content}
        </div>
    {/each}
</div>

<style>
</style>
