<script lang="ts">
    import TextInput from './TextInput.svelte';

    export let required: boolean = false;
</script>

<TextInput
    icon="material-symbols:alternate-email-rounded"
    type="email"
    placeholder="E-mail"
    name="email"
    {required}
/>
