<script lang="ts">
	import { storyblokEditable } from '$lib/storyblok'

	let { blok } = $props()
</script>

<div use:storyblokEditable={blok} class="border border-brand-sand rounded-xl p-6 transition-all hover:shadow-lg hover:border-transparent">
	<h2 class="font-serif text-2xl font-bold text-brand-ink">
		{blok.name}
	</h2>
</div>
