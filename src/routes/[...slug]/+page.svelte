<script lang="ts">
	import { useStoryblokBridge, StoryblokComponent } from '$lib/storyblok';
	import { browser } from '$app/environment';

	let { data } = $props();
	let bridgeContent = $state<any>(null);
	const story = $derived(data.story);
	const content = $derived(
		bridgeContent
			? {
					...bridgeContent,
					_categories: story?.content?._categories,
					_articles: story?.content?._articles,
					_first_published_at: story?.first_published_at,
					_published_at: story?.published_at
				}
			: story?.content
				? {
						...story.content,
						_first_published_at: story.first_published_at,
						_published_at: story.published_at
					}
				: undefined
	);

	$effect(() => {
		if (browser && story) {
			bridgeContent = null;
			useStoryblokBridge(
				story.id,
				(newStory) => (bridgeContent = newStory.content),
				{
					resolveRelations: data.resolveRelations ?? [],
					preventClicks: true
				}
			);
		}
	});
</script>

<svelte:head>
	<title>{content?.headline || content?.title || content?.name || story?.name || 'Story Drops'}</title>
	{#if content?.subheadline || content?.description}
		<meta name="description" content={content?.subheadline || (typeof content?.description === 'string' ? content.description : '')} />
	{/if}
</svelte:head>

{#key story?.id}
	{#if content}
		<StoryblokComponent blok={content} />
	{/if}
{/key}
