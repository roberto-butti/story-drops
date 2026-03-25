<script lang="ts">
	import { storyblokEditable } from '$lib/storyblok';
	import { storyblokFetch } from '$lib/storyblok/api';
	import { PUBLIC_STORYBLOK_VERSION } from '$env/static/public';

	let { blok } = $props();

	const isListView = $derived(blok.layout === 'list');

	async function fetchArticles() {
		const params: Record<string, unknown> = {
			version: PUBLIC_STORYBLOK_VERSION,
			content_type: 'article',
			sort_by: blok.sort_by || 'first_published_at:desc',
			per_page: blok.per_page || 6
		};
		if (blok.starts_with) {
			params.starts_with = blok.starts_with;
		}
		if (Array.isArray(blok.categories) && blok.categories.length) {
			params.filter_query = {
				category: { in: blok.categories.join(',') }
			};
		}
		const { data } = await storyblokFetch('cdn/stories', params);
		return data.stories || [];
	}

	const articlesPromise = $derived(fetchArticles());
</script>

<section use:storyblokEditable={blok}>
	{#if blok.headline}
		<h2 class="text-2xl font-bold leading-tight text-brand-ink mb-8">{blok.headline}</h2>
	{/if}

	{#await articlesPromise then articles}
		{#if articles.length}
			{#if isListView}
				<div class="divide-y divide-brand-sand">
					{#each articles as article (article.uuid)}
						<article class="flex gap-5 py-6 first:pt-0 last:pb-0">
							{#if article.content?.cover_image?.filename}
								<a href={`/${article.full_slug}`} class="shrink-0">
									<img
										src={`${article.content.cover_image.filename}/m/160x0`}
										alt={article.content.cover_image.alt || article.name}
										width="160"
										loading="lazy"
										class="w-28 sm:w-40 rounded-lg object-cover aspect-[4/3]"
									/>
								</a>
							{/if}
							<div class="min-w-0">
								<h3 class="text-lg font-bold leading-tight text-brand-ink mb-1">
									<a href={`/${article.full_slug}`} class="hover:underline">
										{article.content?.headline || article.name}
									</a>
								</h3>
								{#if article.content?.subheadline}
									<p class="text-sm text-brand-muted mb-3 leading-relaxed line-clamp-2">
										{article.content.subheadline}
									</p>
								{/if}
								<a
									href={`/${article.full_slug}`}
									class="inline-flex items-center font-medium text-sm underline underline-offset-4 text-brand-accent hover:no-underline"
								>
									Read more<span class="sr-only">: {article.content?.headline || article.name}</span>
								</a>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
					{#each articles as article (article.uuid)}
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
							<h3 class="text-xl font-bold leading-tight text-brand-ink mb-2">
								<a href={`/${article.full_slug}`} class="hover:underline">
									{article.content?.headline || article.name}
								</a>
							</h3>
							{#if article.content?.subheadline}
								<p class="text-sm text-brand-muted mb-4 leading-relaxed">
									{article.content.subheadline}
								</p>
							{/if}
							{#if article.first_published_at}
								<p class="text-xs text-brand-muted mb-4">
									{new Date(article.first_published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
								</p>
							{/if}
							<a
								href={`/${article.full_slug}`}
								class="inline-flex items-center font-medium text-sm underline underline-offset-4 text-brand-accent hover:no-underline"
							>
								Read more<span class="sr-only">: {article.content?.headline || article.name}</span>
							</a>
						</article>
					{/each}
				</div>
			{/if}
		{/if}
	{/await}
</section>
