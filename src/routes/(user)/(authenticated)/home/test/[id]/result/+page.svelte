<script lang="ts">
    import TestResult from "$lib/components/testview/TestResult.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<TestResult test={data.submission.assignedTest} submission={data.submission} />
