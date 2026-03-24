<script lang="ts">
	import { getComponent } from './components'

	let { blok, ...rest }: { blok: any; [key: string]: any } = $props()

	const Component = $derived(blok ? getComponent(blok.component) : null)
</script>

{#if Component}
	<Component {blok} {...rest} />
{/if}
