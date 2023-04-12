<script lang="ts">
    import TestResult from '$lib/components/testview/TestResult.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<TestResult
    assignment={data.submission.assignment}
    submission={data.submission.assignment.submissions[0]}
/>
