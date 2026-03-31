<script lang="ts">
	import { renderRichText } from '$lib/storyblok';
	import Heading from '$lib/components/atoms/Heading.svelte';

	let { title, description }: { title?: string; description?: any } = $props();

	const descriptionHtml = $derived(description ? renderRichText(description) : '');
</script>

{#if title}
	<Heading level={2} class="mb-4">{title}</Heading>
{/if}

{#if descriptionHtml}
	<div class="prose mb-8 max-w-2xl text-brand-muted">
		{@html descriptionHtml}
	</div>
{/if}
