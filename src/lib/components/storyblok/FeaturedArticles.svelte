<script lang="ts">
	import { storyblokEditable, renderRichText } from '$lib/storyblok';
	import Heading from '$lib/components/atoms/Heading.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let { blok } = $props();

	const descriptionHtml = $derived(blok.description ? renderRichText(blok.description) : '');
</script>

<section use:storyblokEditable={blok} class="bg-gray-50 rounded-lg p-6 md:p-8">
	{#if blok.title}
		<Heading level={2} class="mb-2">{blok.title}</Heading>
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
					<article class="flex flex-col">
						{#if story.content?.cover_image?.filename}
							<a href={`/${story.full_slug}`}>
								<img
									src={`${story.content.cover_image.filename}/m/600x400`}
									alt={story.content.cover_image.alt || story.name}
									width="600"
									height="400"
									loading="lazy"
									class="w-full rounded-lg mb-5 aspect-video object-cover"
								/>
							</a>
						{/if}
						<Heading level={3} class="mb-2">
							<a href={`/${story.full_slug}`} class="hover:underline">
								{story.content?.headline || story.name}
							</a>
						</Heading>
						{#if story.content?.subheadline}
							<p class="text-sm text-brand-muted mb-4 leading-relaxed">
								{story.content.subheadline}
							</p>
						{/if}
						<div class="mt-auto pt-4">
							<Button href={`/${story.full_slug}`}>
								Read more<span class="sr-only">: {story.content?.headline || story.name}</span>
							</Button>
						</div>
					</article>
				{/if}
			{/each}
		</div>
	{/if}
</section>
