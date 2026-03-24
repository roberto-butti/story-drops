<script lang="ts">
	import { storyblokEditable } from '$lib/storyblok';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import CategoryGrid from '$lib/components/CategoryGrid.svelte';

	let { blok } = $props();
</script>

<section use:storyblokEditable={blok} class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24">
	<SectionHeader title={blok.title} description={blok.description} />
	<CategoryGrid categories={blok._categories ?? []} />
</section>
