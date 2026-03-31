<script lang="ts">
	import Heading from '$lib/components/atoms/Heading.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let { categories }: { categories: any[] } = $props();
</script>

{#if categories?.length}
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
		{#each categories as category (category.uuid)}
			<article class="rounded-lg border border-brand-sand p-5 transition-shadow hover:shadow-md">
				<Heading level={3} class="mb-2">
					<a href={`/${category.full_slug}`} class="hover:underline">
						{category.content?.name || category.name}
					</a>
				</Heading>
				{#if category.content?.description}
					{@const preview = category.content.description.content?.[0]?.content?.[0]?.text}
					{#if preview}
						<p class="text-sm text-brand-muted mb-4 leading-relaxed">
							{preview}
						</p>
					{/if}
				{/if}
				<Button href={`/${category.full_slug}`}>
					View articles
				</Button>
			</article>
		{/each}
	</div>
{/if}
