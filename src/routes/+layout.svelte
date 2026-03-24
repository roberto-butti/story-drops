<script lang="ts">
	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-white antialiased">
	{#if data.config}
		<Navbar config={data.config.content} />
	{/if}

	<main class="flex-1">
		{@render children()}
	</main>

	{#if data.config}
		<Footer config={data.config.content} />
	{/if}
</div>
