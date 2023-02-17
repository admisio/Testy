<script lang="ts">
    import TestResult from "$lib/components/testview/TestResult.svelte";
    import type { PageData } from "./$types";


    export let data: PageData;
    const test = data.test!;
</script>

<TestResult test={data.test} submission={data.submission} />
