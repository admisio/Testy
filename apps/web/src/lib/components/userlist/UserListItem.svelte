<script lang="ts">
    import type { Prisma } from '@testy/database';
    import UserSettings from './UserSettings.svelte';

    export let user: Prisma.UserGetPayload<{
        select: {
            id: true;
            username: true;
            name: true;
            email: true;
        };
    }>;
</script>

<div
    class="flex items-center relative mx-3 mb-6 flex-grow basis-[32%] rounded-lg border border-gray-200 bg-white p-6 shadow"
>
    [ID {user.id}]

    {user.username}

    {user.name}

    {user.email}

    <div class="ml-auto">
        <UserSettings />
    </div>
</div>
