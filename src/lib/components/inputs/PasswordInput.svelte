<script lang="ts">
    import TextInput from './TextInput.svelte';

    export let required: boolean = false;
    export let focus: boolean = false;
</script>

<TextInput
    icon="ic:outline-remove-red-eye"
    type="password"
    placeholder="Heslo"
    name="password"
    {required}
    {focus}
/>
