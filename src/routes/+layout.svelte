<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import '@picocss/pico';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant:wght@500&display=swap&text=BOOKSTALFNTYVE"
    rel="stylesheet"
  />
</svelte:head>

<Header isAuthenticated={data.isAuthenticated} />
<main class="container">
  <slot />
</main>
<Footer />

<style windi:preflights:global windi:safelist:global>
	:global(html) {
		font-family: 'Poppins', sans-serif;
	}
</style>

