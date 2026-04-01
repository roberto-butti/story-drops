<script lang="ts">
	import { storyblokEditable, renderRichText } from '$lib/storyblok';
	import { renderRichTextToMarkdown } from '$lib/storyblok/richtext-markdown';
	import { highlightCodeBlocks } from '$lib/storyblok/syntax-highlight';
	import Button from '$lib/components/atoms/Button.svelte';

	let { blok } = $props();

	const rawHtml = $derived(blok.text ? renderRichText(blok.text) : '');
	const articleMarkdown = $derived(blok.text ? renderRichTextToMarkdown(blok.text) : '');
	let highlightedHtml = $state<string | null>(null);
	let showMarkdown = $state(false);

	// Raw HTML renders immediately (SSR). Shiki enhances it on the client.
	const articleHtml = $derived(highlightedHtml ?? rawHtml);

	$effect(() => {
		// Reset when content changes, so rawHtml shows while highlighting runs
		highlightedHtml = null;
		if (rawHtml) {
			highlightCodeBlocks(rawHtml).then((result) => {
				highlightedHtml = result;
			});
		}
	});

	function formatDate(dateStr: string | null | undefined): string {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<article use:storyblokEditable={blok} class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24">
	<header class="mb-4 lg:mb-6">
		{#if Array.isArray(blok.category) && blok.category.length}
			<div class="mb-6 flex flex-wrap gap-2">
				{#each blok.category as cat (cat.uuid ?? cat)}
					{#if typeof cat !== 'string'}
						<a
							href={`/${cat.full_slug}`}
							class="inline-flex items-center rounded-lg bg-violet-50 px-3 py-1 hover:bg-violet-100 transition-colors"
						>
							<span class="font-sans text-xs font-bold text-brand-accent">
								{cat.content?.name || cat.name}
							</span>
						</a>
					{/if}
				{/each}
			</div>
		{/if}
		<h1 class="font-heading mb-4 text-3xl font-extrabold leading-tight text-brand-ink lg:mb-6 lg:text-4xl">
			{blok.headline}
		</h1>
		{#if blok.subheadline}
			<p class="text-lg text-brand-muted lg:text-xl">
				{blok.subheadline}
			</p>
		{/if}
		{#if blok._first_published_at || blok._published_at}
			<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-muted">
				{#if blok._first_published_at}
					<time datetime={blok._first_published_at}>
						Published {formatDate(blok._first_published_at)}
					</time>
				{/if}
				{#if blok._published_at && blok._published_at !== blok._first_published_at}
					<span class="text-brand-sand">|</span>
					<time datetime={blok._published_at}>
						Updated {formatDate(blok._published_at)}
					</time>
				{/if}
			</div>
		{/if}
	</header>

	{#if blok.cover_image?.filename}
		<img
			src={`${blok.cover_image.filename}/m/900x500`}
			alt={blok.cover_image.alt || blok.headline}
			width="900"
			height="500"
			fetchpriority="high"
			class="mb-8 w-full rounded-lg object-cover"
		/>
	{/if}

	{#if articleHtml}
		<div class="mb-6 flex justify-end">
			<Button variant="link" onclick={() => (showMarkdown = true)}>
				Show Markdown
			</Button>
		</div>

		<div class="prose prose-base sm:prose-base lg:prose-lg max-w-none text-brand-ink prose-headings:font-heading prose-headings:font-extrabold prose-headings:leading-tight prose-headings:text-brand-ink prose-a:text-brand-accent prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline prose-img:rounded-lg prose-blockquote:border-brand-accent">
			{@html articleHtml}
		</div>
	{/if}
</article>

{#if showMarkdown}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
		onkeydown={(e) => e.key === 'Escape' && (showMarkdown = false)}
		onclick={(e) => e.target === e.currentTarget && (showMarkdown = false)}
	>
		<div class="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-brand-paper shadow-2xl">
			<div class="flex items-center justify-between border-b border-brand-sand px-6 py-4">
				<h2 class="font-sans text-sm font-bold text-brand-ink">Markdown output</h2>
				<button
					onclick={() => (showMarkdown = false)}
					class="font-sans text-sm font-medium text-brand-muted hover:text-brand-ink transition-colors"
				>
					Close
				</button>
			</div>
			<pre class="overflow-auto p-6 font-mono text-sm leading-relaxed text-brand-ink max-h-[calc(80vh-60px)]">{articleMarkdown}</pre>
		</div>
	</div>
{/if}
