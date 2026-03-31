<script lang="ts">
	import { storyblokEditable } from '$lib/storyblok'
	import Button from '$lib/components/atoms/Button.svelte'

	let { blok } = $props()
</script>

<section use:storyblokEditable={blok}>
	<h1 class="text-4xl font-extrabold leading-tight text-brand-ink mb-4 lg:text-5xl">
		{blok.headline}
	</h1>
	{#if blok.subheadline}
		<p class="text-lg text-brand-muted max-w-2xl mb-8 lg:text-xl">
			{blok.subheadline}
		</p>
	{/if}
	{#if blok.cta_label && blok.cta_link}
		<Button href={blok.cta_link.cached_url ? `/${blok.cta_link.cached_url}` : blok.cta_link.url || '#'}>
			{blok.cta_label}
		</Button>
	{/if}
</section>
