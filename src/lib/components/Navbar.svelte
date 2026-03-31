<script lang="ts">
	import { page } from '$app/state'
	import { storyblokEditable } from '$lib/storyblok'
	import icon from '$lib/assets/icon.svg'

	let { config, categories = [] }: { config: any; categories?: any[] } = $props()
	let mobileOpen = $state(false)
	let dropdownOpen = $state(false)

	function linkHref(item: any): string {
		return item.link?.cached_url ? `/${item.link.cached_url}` : item.link?.url || '#'
	}

	function isActive(item: any): boolean {
		const href = linkHref(item)
		return page.url.pathname === href || page.url.pathname === `${href}/`
	}

	function hasCategories(item: any): boolean {
		const url = item.link?.cached_url || ''
		return categories.length > 0 && url.includes('articles')
	}

	function closeDropdown() {
		dropdownOpen = false
	}
</script>

<svelte:window onclick={closeDropdown} />

<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-brand-accent focus:underline focus:rounded">
	Skip to content
</a>

<nav use:storyblokEditable={config} aria-label="Main navigation" class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-brand-sand">
	<div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
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
			<!-- Desktop nav -->
			<ul class="hidden sm:flex items-center gap-6">
				{#each config.nav_links as item (item._uid)}
					<li class="relative">
						{#if hasCategories(item)}
							<button
								onclick={(e: MouseEvent) => { e.stopPropagation(); dropdownOpen = !dropdownOpen }}
								aria-expanded={dropdownOpen}
								aria-haspopup="true"
								class="inline-flex items-center gap-1 text-sm font-medium transition-colors {isActive(item)
									? 'text-brand-accent'
									: 'text-brand-muted hover:text-brand-ink'}"
							>
								{item.label}
								<svg class="h-3.5 w-3.5 transition-transform {dropdownOpen ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
								</svg>
							</button>

							{#if dropdownOpen}
									<div
									onclick={(e: MouseEvent) => e.stopPropagation()}
									onkeydown={(e: KeyboardEvent) => { if (e.key === 'Escape') closeDropdown() }}
									role="menu"
									tabindex="-1"
									class="absolute right-0 top-full mt-2 w-56 rounded-lg border border-brand-sand bg-white py-1 shadow-lg"
								>
									<a
										href={linkHref(item)}
										onclick={closeDropdown}
										class="block px-4 py-2 text-sm font-medium text-brand-ink hover:bg-gray-50 transition-colors"
									>
										All articles
									</a>
									<div class="my-1 border-t border-brand-sand"></div>
									{#each categories as cat (cat.uuid)}
										<a
											href={`/${cat.full_slug}`}
											onclick={closeDropdown}
											class="block px-4 py-2 text-sm text-brand-muted hover:text-brand-ink hover:bg-gray-50 transition-colors"
										>
											{cat.content?.name || cat.name}
										</a>
									{/each}
								</div>
							{/if}
						{:else}
							<a
								href={linkHref(item)}
								aria-current={isActive(item) ? 'page' : undefined}
								class="text-sm font-medium transition-colors {isActive(item)
									? 'text-brand-accent'
									: 'text-brand-muted hover:text-brand-ink hover:underline'}"
							>
								{item.label}
							</a>
						{/if}
					</li>
				{/each}
			</ul>

			<!-- Mobile hamburger -->
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="sm:hidden p-2 -mr-2 text-brand-muted hover:text-brand-ink transition-colors"
				aria-expanded={mobileOpen}
				aria-controls="mobile-nav"
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
			>
				{#if mobileOpen}
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				{/if}
			</button>
		{/if}
	</div>

	<!-- Mobile nav panel -->
	{#if mobileOpen && config.nav_links?.length}
		<ul id="mobile-nav" class="sm:hidden border-t border-brand-sand px-4 py-3 space-y-1">
			{#each config.nav_links as item (item._uid)}
				<li>
					<a
						href={linkHref(item)}
						onclick={() => (mobileOpen = false)}
						aria-current={isActive(item) ? 'page' : undefined}
						class="block py-2 text-sm font-medium transition-colors {isActive(item)
							? 'text-brand-accent'
							: 'text-brand-muted hover:text-brand-ink'}"
					>
						{item.label}
					</a>
					{#if hasCategories(item)}
						<ul class="pl-4 space-y-1">
							{#each categories as cat (cat.uuid)}
								<li>
									<a
										href={`/${cat.full_slug}`}
										onclick={() => (mobileOpen = false)}
										class="block py-1.5 text-sm text-brand-muted hover:text-brand-ink transition-colors"
									>
										{cat.content?.name || cat.name}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</nav>
