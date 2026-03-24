<script lang="ts">
	let { categories }: { categories: any[] } = $props();
</script>

{#if categories?.length}
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
		{#each categories as category (category.uuid)}
			<article>
				<h3 class="text-xl font-bold leading-tight text-brand-ink mb-2">
					<a href={`/${category.full_slug}`} class="hover:underline">
						{category.content?.name || category.name}
					</a>
				</h3>
				{#if category.content?.description}
					{@const preview = category.content.description.content?.[0]?.content?.[0]?.text}
					{#if preview}
						<p class="text-sm text-brand-muted mb-4 leading-relaxed">
							{preview}
						</p>
					{/if}
				{/if}
				<a
					href={`/${category.full_slug}`}
					class="inline-flex items-center font-medium text-sm underline underline-offset-4 text-brand-accent hover:no-underline"
				>
					View articles
				</a>
			</article>
		{/each}
	</div>
{/if}
