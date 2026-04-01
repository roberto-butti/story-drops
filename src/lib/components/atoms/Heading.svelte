<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		level = 2,
		size = level === 2 ? '2xl' : 'xl',
		class: className = '',
		children
	}: {
		level?: 2 | 3
		size?: 'sm' | 'lg' | 'xl' | '2xl'
		class?: string
		children: Snippet
	} = $props()

	const sizeClasses: Record<string, string> = {
		sm: 'text-lg',
		lg: 'text-lg',
		xl: 'text-xl',
		'2xl': 'text-2xl'
	}

	const base = $derived(`${sizeClasses[size]} font-heading font-bold leading-tight text-brand-ink`)
</script>

{#if level === 2}
	<h2 class="{base} {className}">
		{@render children()}
	</h2>
{:else}
	<h3 class="{base} {className}">
		{@render children()}
	</h3>
{/if}
