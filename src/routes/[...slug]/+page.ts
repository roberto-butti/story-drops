import { storyblokFetch } from '$lib/storyblok';
import { PUBLIC_STORYBLOK_VERSION } from '$env/static/public';
import { error } from '@sveltejs/kit';

const resolveRelations = ['articles_list.articles', 'article.category', 'featured-articles.articles'];

export async function load({ params }) {
	const slug = params.slug || 'home';

	try {
		const version = PUBLIC_STORYBLOK_VERSION as 'draft' | 'published';

		const { data } = await storyblokFetch(`cdn/stories/${slug}`, {
			version,
			resolve_relations: resolveRelations.join(',')
		});

		const story = data.story;

		// If this is an article-category page, fetch articles with this category
		if (story.content.component === 'article-category') {
			const { data: articlesData } = await storyblokFetch('cdn/stories', {
				version,
				content_type: 'article',
				filter_query: {
					category: { in: story.uuid }
				},
				sort_by: 'created_at:desc',
				per_page: 50
			});
			story.content._articles = articlesData.stories;
		}

		// If page body contains a categories_list blok, fetch all categories
		if (story.content.component === 'categories-list') {
			const { data: categoriesData } = await storyblokFetch('cdn/stories', {
				version,
				content_type: 'article-category',
				sort_by: 'name:asc',
				per_page: 50
			});
			story.content._categories = categoriesData.stories || [];
		}

		return { story, resolveRelations };
	} catch (e: any) {
		if (e?.status === 404) {
			error(404, { message: 'Story not found' });
		}
		throw e;
	}
}
