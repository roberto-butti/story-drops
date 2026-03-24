<script lang="ts">
	import { storyblokEditable } from '$lib/storyblok'

	let { blok } = $props()
</script>

<div use:storyblokEditable={blok}>
	<h1 class="text-3xl font-extrabold leading-tight text-brand-ink lg:text-4xl">
		{blok.headline}
	</h1>
</div>
