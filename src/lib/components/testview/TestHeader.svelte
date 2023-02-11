<script lang="ts">
    import { formatDate, formatTime, remainingTime } from "$lib/trpc/utils/date";

    export let name: string;
    export let surname: string;
    export let testTitle: string;
    export let endTime: Date | null;
</script>

<div class="flex flex-col justify-center w-full bg-sspsBlueDark h-full">
    <div class="flex flex-row justify-between px-6">
        <div class="flex self-center">
            <span class="font-bold text-2xl">{name}</span>
            <span class="ml-3 font-bold text-2xl">{surname.toUpperCase()}</span>
        </div>
        <span class="font-bold text-2xl">{testTitle}</span>
        <div class="flex flex-col">
            <span class="font-bold text-2xl">Test skončí v {formatTime(endTime)}</span>
        </div>
    </div>
</div>