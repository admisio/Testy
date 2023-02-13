<script lang="ts">
    import TextInput from './TextInput.svelte';

    export let required: boolean = false;
    export let placeholder: string = 'Uživatel';
</script>

<TextInput
    icon="material-symbols:person-2-outline-rounded"
    type="username"
    {placeholder}
    name="username"
    {required}
/>
