<script>

  import { enhance } from "$app/forms";

</script>
<!-- file upload form -->

<div>
    <form method="POST" use:enhance >
        <label for="title">Title:</label>
        <input type="text" name="title" id="title" />
        <label for="files">Select files:</label>
        <input type="file" name="file" id="file" multiple />
        <input type="submit" value="Upload" />
    </form>
</div>