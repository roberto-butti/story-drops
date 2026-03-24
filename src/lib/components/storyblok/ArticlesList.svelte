<script lang="ts">
	import { storyblokEditable } from '$lib/storyblok'

	let { blok } = $props()
</script>

<section use:storyblokEditable={blok}>
	{#if blok.title}
		<h2 class="text-2xl font-bold leading-tight text-brand-ink mb-8">{blok.title}</h2>
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
									width="600"
									height="400"
									loading="lazy"
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
