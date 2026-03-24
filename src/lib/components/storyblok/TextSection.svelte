<script lang="ts">
	import { storyblokEditable, renderRichText } from '$lib/storyblok';

	let { blok } = $props();

	const bodyHtml = $derived(blok.text ? renderRichText(blok.text) : '');
</script>

<section use:storyblokEditable={blok}>
	{#if blok.headline}
		<h2 class="text-2xl font-bold leading-tight text-brand-ink mb-4">{blok.headline}</h2>
	{/if}

	{#if bodyHtml}
		<div class="prose prose-base lg:prose-lg max-w-none text-brand-ink prose-a:text-brand-accent prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline mb-6">
			{@html bodyHtml}
		</div>
	{/if}

	{#if blok.cta_label && blok.cta_link}
		<a
			href={blok.cta_link.cached_url ? `/${blok.cta_link.cached_url}` : blok.cta_link.url || '#'}
			target={blok.cta_link.linktype === 'url' ? '_blank' : undefined}
			rel={blok.cta_link.linktype === 'url' ? 'noopener noreferrer' : undefined}
			class="inline-flex items-center font-medium text-sm underline underline-offset-4 text-brand-accent hover:no-underline"
		>
			{blok.cta_label}
		</a>
	{/if}
</section>
