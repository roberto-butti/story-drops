<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		href = '',
		variant = 'primary',
		class: className = '',
		onclick,
		children
	}: {
		href?: string
		variant?: 'primary' | 'link'
		class?: string
		onclick?: (e: MouseEvent) => void
		children: Snippet
	} = $props()

	const base = $derived(
		variant === 'primary'
			? 'inline-flex items-center gap-2 font-sans text-sm font-bold text-white bg-brand-accent rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors'
			: 'inline-flex items-center font-medium text-sm underline underline-offset-4 text-brand-accent hover:no-underline'
	)
</script>

{#if href}
	<a {href} {onclick} class="{base} {className}">
		{@render children()}
	</a>
{:else}
	<button {onclick} class="{base} {className}">
		{@render children()}
	</button>
{/if}
