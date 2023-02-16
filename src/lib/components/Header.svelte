<script lang="ts">
    import logo from '$lib/assets/logo/logo.jpg';
</script>

<header>
    <nav class="border-gray-200 bg-white">
        <div
            class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2.5 md:px-6"
        >
            <a href="/home" class="flex items-center">
                <img src={logo} class="mr-3 h-6 rounded-full sm:h-9 shadow-lg" alt="Logo" />
                <h1 class="self-center whitespace-nowrap text-xl font-semibold">Testy</h1>
            </a>
            <div class="flex items-center">
                <a href="/auth/logout" class="text-sm font-medium text-[#3580b7] hover:underline"
                    >Odhlásit se</a
                >
            </div>
        </div>
    </nav>
    <nav class="bg-gray-50">
        <div class="mx-auto max-w-screen-xl px-4 py-3 md:px-6">
            <div class="flex items-center">
                <ul class="mt-0 mr-6 flex flex-row space-x-8 text-sm font-medium">
                    <li>
                        <a href="/home" aria-current="page">Home</a>
                    </li>
                    <li>
                        <a href="/home/tests">Testy</a>
                    </li>
                    <li>
                        <a href="/home/results">Výsledky</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>

<style lang="postcss">
    li a {
        @apply text-gray-900;
    }
    li a:hover {
        @apply underline;
    }
</style>
