<script lang="ts">
	import { StoryblokComponent, storyblokEditable } from '$lib/storyblok'

	let { blok } = $props()
</script>

<div use:storyblokEditable={blok} class="grid grid-cols-1 md:grid-cols-3 gap-6">
	{#each blok.columns as column (column._uid)}
		<StoryblokComponent blok={column} />
	{/each}
</div>
