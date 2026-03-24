<script lang="ts">
	import { storyblokEditable } from '$lib/storyblok'

	let { config } = $props()
</script>

<footer use:storyblokEditable={config} class="bg-gray-50">
	<div class="px-4 sm:px-6 lg:px-8 py-8 mx-auto max-w-3xl lg:py-12">
		<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
			<div>
				<p class="text-xl font-semibold text-brand-ink">{config.title || 'Story Drops'}</p>
				{#if config.description}
					<p class="text-sm text-brand-muted mt-2 max-w-sm">{config.description}</p>
				{/if}
			</div>

			{#if config.links?.length}
				<ul class="flex items-center gap-6">
					{#each config.links as item (item._uid)}
						<li>
							<a
								href={item.link?.cached_url ? `/${item.link.cached_url}` : item.link?.url || '#'}
								target={item.link?.linktype === 'url' ? '_blank' : undefined}
								rel={item.link?.linktype === 'url' ? 'noopener noreferrer' : undefined}
								class="text-sm text-brand-muted hover:underline"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		{#if config.copyright}
			<hr class="my-6 border-gray-200 sm:mx-auto lg:my-8">
			<p class="text-sm text-center text-brand-muted">{config.copyright}</p>
		{/if}
	</div>
</footer>
