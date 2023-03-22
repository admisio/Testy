<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
    const test = data.template!;

    import hljs from 'highlight.js';
    import 'highlight.js/styles/github.css';

    import { onMount } from 'svelte';
    import TestPreview from '$lib/components/testpreview/TestPreview.svelte';

    onMount(() => {
        document.querySelectorAll('.description code').forEach((el) => {
            hljs.highlightElement(el as HTMLElement);
        });
    });
</script>

<div
    class="<md:flex-col mx-auto mx-auto mb-6 flex max-w-screen-xl  items-center px-4 px-4 py-3 md:px-6 md:px-6"
>
    <h1 class="<md:mb-3 text-6xl font-bold text-[#3580b7]">Úprava testu / {test.title}</h1>
</div>

<TestPreview {test} />
