import { browser } from '$app/environment'

let bridgePromise: Promise<void> | null = null

function loadBridgeScript(): Promise<void> {
	if (!browser) return Promise.resolve()
	if (bridgePromise) return bridgePromise

	if ((window as any).StoryblokBridge) {
		bridgePromise = Promise.resolve()
		return bridgePromise
	}

	bridgePromise = new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js'
		script.async = true
		script.onload = () => resolve()
		script.onerror = () => reject(new Error('Failed to load Storyblok Bridge'))
		document.head.appendChild(script)
	})

	return bridgePromise
}

export async function useStoryblokBridge(
	storyId: number,
	callback: (story: any) => void,
	options: { resolveRelations?: string[]; preventClicks?: boolean } = {}
): Promise<void> {
	if (!browser) return

	await loadBridgeScript()

	const BridgeConstructor = (window as any).StoryblokBridge
	if (!BridgeConstructor) return

	const bridge = new BridgeConstructor({
		resolveRelations: options.resolveRelations,
		preventClicks: options.preventClicks
	})

	if (options.preventClicks) {
		document.addEventListener('click', (e) => {
			const link = (e.target as HTMLElement).closest('a[href]')
			if (link) {
				e.preventDefault()
			}
		})
	}

	bridge.on('input', (event: any) => {
		console.log('[bridge] input', {
			action: event.action,
			storyId: event.story?.id,
			storyName: event.story?.name,
			slug: event.story?.slug,
			publishedAt: event.story?.published_at,
			firstPublishedAt: event.story?.first_published_at,
			contentChanged: event.story?.id === storyId,
			event
		})
		if (event.story && event.story.id === storyId) {
			callback(event.story)
		}
	})

	bridge.on(['change', 'published'], (event: any) => {
		console.log('[bridge] change/published', {
			action: event?.action,
			storyId: event?.storyId,
			event
		})
		window.location.reload()
	})

	bridge.on('enterEditmode', (event: any) => {
		console.log('[bridge] enterEditmode', { event })
	})

	bridge.on('customEvent', (event: any) => {
		console.log('[bridge] customEvent', { event })
	})
}
