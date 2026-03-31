<script lang="ts">
	import { storyblokEditable, renderRichText } from '$lib/storyblok';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let { blok } = $props();

	const descriptionHtml = $derived(blok.description ? renderRichText(blok.description) : '');
</script>

<div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24">
	<div class="space-y-12 lg:space-y-16">
		<header use:storyblokEditable={blok}>
			<span class="mb-4 inline-block rounded-lg bg-blue-50 px-3 py-1 font-sans text-xs font-bold text-brand-accent uppercase tracking-widest"
				>Category</span
			>
			<h1 class="mb-4 text-3xl font-extrabold leading-tight text-brand-ink lg:mb-6 lg:text-4xl">
				{blok.name}
			</h1>
			{#if descriptionHtml}
				<div class="prose prose-lg max-w-2xl text-brand-muted">
					{@html descriptionHtml}
				</div>
			{/if}
		</header>

		{#if blok._articles?.length}
			<section class="space-y-8">
				<Heading level={2}>Articles</Heading>
				<div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
					{#each blok._articles as article (article.uuid)}
						<article>
							{#if article.content?.cover_image?.filename}
								<a href={`/${article.full_slug}`}>
									<img
										src={`${article.content.cover_image.filename}/m/600x400`}
										alt={article.content.cover_image.alt || article.name}
										width="600"
										height="400"
										loading="lazy"
										class="w-full rounded-lg mb-5 aspect-video object-cover"
									/>
								</a>
							{/if}
							<Heading level={3} class="mb-2">
								<a href={`/${article.full_slug}`} class="hover:underline">
									{article.content?.headline || article.name}
								</a>
							</Heading>
							{#if article.content?.subheadline}
								<p class="text-sm text-brand-muted mb-4 leading-relaxed">
									{article.content.subheadline}
								</p>
							{/if}
							<Button href={`/${article.full_slug}`}>
								Read more<span class="sr-only">: {article.content?.headline || article.name}</span>
							</Button>
						</article>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>
