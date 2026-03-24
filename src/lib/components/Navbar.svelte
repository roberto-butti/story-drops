<script lang="ts">
	import { storyblokEditable } from '$lib/storyblok'
	import icon from '$lib/assets/icon.svg'

	let { config } = $props()
</script>

<nav use:storyblokEditable={config} class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-brand-sand">
	<a href="/" class="flex items-center gap-3">
		<img src={icon} alt={config.title || 'Story Drops'} class="h-8 w-auto" />
		<div class="flex flex-col">
			<span class="text-xl font-bold text-brand-ink leading-none">{config.title || 'Story Drops'}</span>
			{#if config.tagline}
				<span class="text-xs text-brand-muted">{config.tagline}</span>
			{/if}
		</div>
	</a>

	{#if config.nav_links?.length}
		<ul class="flex items-center gap-6">
			{#each config.nav_links as item (item._uid)}
				<li>
					<a
						href={item.link?.cached_url ? `/${item.link.cached_url}` : item.link?.url || '#'}
						class="text-sm font-medium text-brand-muted hover:text-brand-ink hover:underline transition-colors"
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</nav>
