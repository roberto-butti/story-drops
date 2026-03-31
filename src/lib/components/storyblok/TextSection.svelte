<script lang="ts">
	import { storyblokEditable, renderRichText } from '$lib/storyblok';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let { blok } = $props();

	const bodyHtml = $derived(blok.text ? renderRichText(blok.text) : '');
</script>

<section use:storyblokEditable={blok}>
	{#if blok.headline}
		<Heading level={2} class="mb-4">{blok.headline}</Heading>
	{/if}

	{#if bodyHtml}
		<div class="prose prose-base lg:prose-lg max-w-none text-brand-ink prose-a:text-brand-accent prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline mb-6">
			{@html bodyHtml}
		</div>
	{/if}

	{#if blok.cta_label && blok.cta_link}
		<Button href={blok.cta_link.cached_url ? `/${blok.cta_link.cached_url}` : blok.cta_link.url || '#'}>
			{blok.cta_label}
		</Button>
	{/if}
</section>
