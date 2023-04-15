<script lang="ts">
    import { loadIcons } from '@iconify/svelte';
    import { onMount } from 'svelte';
    import TextInput from './TextInput.svelte';

    export let required: boolean = false;
    export let focus: boolean = false;
    export let error: boolean = false;

    const hiddenPasswordEye = 'mdi:eye-outline';
    const visiblePasswordEye = 'mdi:eye-off-outline';

    onMount(() => {
        loadIcons([hiddenPasswordEye, visiblePasswordEye]);
    });

    let isPasswordVisible = false;
</script>

<TextInput
    on:icon-click={() => {
        isPasswordVisible = !isPasswordVisible;
    }}
    icon={isPasswordVisible ? visiblePasswordEye : hiddenPasswordEye}
    type={isPasswordVisible ? 'text' : 'password'}
    placeholder="Heslo"
    name="password"
    {required}
    {error}
    {focus}
/>
