<script lang="ts">
	import { storyblokEditable, renderRichText } from '$lib/storyblok';

	let { blok } = $props();

	const descriptionHtml = $derived(blok.description ? renderRichText(blok.description) : '');
</script>

<section use:storyblokEditable={blok} class="bg-gray-50 rounded-lg p-6 md:p-8">
	{#if blok.title}
		<h2 class="mb-2 text-2xl font-bold leading-tight text-brand-ink">{blok.title}</h2>
	{/if}

	{#if descriptionHtml}
		<div class="prose mb-8 max-w-2xl text-brand-muted">
			{@html descriptionHtml}
		</div>
	{/if}

	{#if blok.articles?.length}
		<div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
			{#each blok.articles as article (article._uid || article.uuid)}
				{@const story = typeof article === 'string' ? null : article}
				{#if story}
					<article>
						{#if story.content?.cover_image?.filename}
							<a href={`/${story.full_slug}`}>
								<img
									src={`${story.content.cover_image.filename}/m/600x400`}
									alt={story.content.cover_image.alt || story.name}
									class="w-full rounded-lg mb-5 aspect-video object-cover"
								/>
							</a>
						{/if}
						<h3 class="text-xl font-bold leading-tight text-brand-ink mb-2">
							<a href={`/${story.full_slug}`} class="hover:underline">
								{story.content?.headline || story.name}
							</a>
						</h3>
						{#if story.content?.subheadline}
							<p class="text-sm text-brand-muted mb-4 leading-relaxed">
								{story.content.subheadline}
							</p>
						{/if}
						<a
							href={`/${story.full_slug}`}
							class="inline-flex items-center font-medium text-sm underline underline-offset-4 text-brand-accent hover:no-underline"
						>
							Read more
						</a>
					</article>
				{/if}
			{/each}
		</div>
	{/if}
</section>
