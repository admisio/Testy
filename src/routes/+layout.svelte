<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import type { LayoutData } from './$types';
  import 'virtual:windi.css'

  export let data: LayoutData;
</script>


  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
	href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600&display=swap"
	rel="stylesheet"
/>


<Header isAuthenticated={data.isAuthenticated} />
<div class="text-green-700 font-bold text-4xl">
  <span class="">TTT</span>
</div>
<main class="container">
  <slot />
</main>

<style windi:preflights:global windi:safelist:global>
	:global(html) {
		font-family: 'Poppins', sans-serif;
	}
</style>

