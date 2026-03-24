<script lang="ts">
	import { StoryblokComponent, storyblokEditable } from '$lib/storyblok'

	let { blok } = $props()
</script>

<div use:storyblokEditable={blok} class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
	<div class="space-y-12 lg:space-y-16">
		{#each blok.body as bodyItem (bodyItem._uid)}
			<StoryblokComponent blok={bodyItem} />
		{/each}
	</div>
</div>
