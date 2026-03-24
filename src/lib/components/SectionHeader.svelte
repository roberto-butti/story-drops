<script lang="ts">
	import { renderRichText } from '$lib/storyblok';

	let { title, description }: { title?: string; description?: any } = $props();

	const descriptionHtml = $derived(description ? renderRichText(description) : '');
</script>

{#if title}
	<h2 class="mb-4 text-2xl font-bold leading-tight text-brand-ink">{title}</h2>
{/if}

{#if descriptionHtml}
	<div class="prose mb-8 max-w-2xl text-brand-muted">
		{@html descriptionHtml}
	</div>
{/if}
