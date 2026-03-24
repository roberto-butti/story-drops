import { PUBLIC_STORYBLOK_TOKEN, PUBLIC_STORYBLOK_REGION } from '$env/static/public'

const regionBaseUrls: Record<string, string> = {
	eu: 'https://api.storyblok.com',
	us: 'https://api-us.storyblok.com',
	ap: 'https://api-ap.storyblok.com',
	ca: 'https://api-ca.storyblok.com',
	cn: 'https://app.storyblokchina.cn'
}

function serializeParams(params: Record<string, unknown>, prefix = ''): string {
	const parts: string[] = []
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue
		const fullKey = prefix ? `${prefix}[${key}]` : key
		if (Array.isArray(value)) {
			parts.push(
				`${encodeURIComponent(fullKey)}=${value.map((v) => encodeURIComponent(String(v))).join(',')}`
			)
		} else if (typeof value === 'object') {
			parts.push(serializeParams(value as Record<string, unknown>, fullKey))
		} else {
			parts.push(`${encodeURIComponent(fullKey)}=${String(value)}`)
		}
	}
	return parts.filter(Boolean).join('&')
}

/**
 * Inline resolved relations into story content.
 * The Storyblok CDN API returns resolved stories in `rels` but keeps
 * raw UUIDs in the content. This function walks the content tree and
 * replaces UUID strings with their resolved story objects.
 */
function inlineRelations(
	content: any,
	rels: any[],
	resolveRelations: string
): void {
	if (!rels?.length || !resolveRelations) return

	const relMap = new Map<string, any>()
	for (const rel of rels) {
		relMap.set(rel.uuid, rel)
	}

	// Parse "component.field" pairs
	const pairs = resolveRelations.split(',').map((r) => {
		const [component, field] = r.trim().split('.')
		return { component, field }
	})

	function walk(node: any): void {
		if (!node || typeof node !== 'object') return

		if (Array.isArray(node)) {
			node.forEach(walk)
			return
		}

		// Check if this node matches any resolve_relations pair
		if (node.component) {
			for (const { component, field } of pairs) {
				if (node.component === component && Array.isArray(node[field])) {
					node[field] = node[field].map((item: any) => {
						if (typeof item === 'string' && relMap.has(item)) {
							return relMap.get(item)
						}
						return item
					})
				}
			}
		}

		// Recurse into nested bloks (body, columns, etc.)
		for (const value of Object.values(node)) {
			if (Array.isArray(value)) {
				value.forEach(walk)
			}
		}
	}

	walk(content)
}

export async function storyblokFetch(
	path: string,
	params: Record<string, unknown> = {}
): Promise<{ data: any }> {
	const baseUrl = regionBaseUrls[PUBLIC_STORYBLOK_REGION] || regionBaseUrls.eu
	const qs = serializeParams({ ...params, token: PUBLIC_STORYBLOK_TOKEN })
	const url = `${baseUrl}/v2/${path}?${qs}`

	const response = await fetch(url)
	if (!response.ok) {
		const err: any = new Error(`Storyblok API error: ${response.status}`)
		err.status = response.status
		throw err
	}

	const json = await response.json()

	// Inline resolved relations into story content
	if (json.rels?.length && params.resolve_relations) {
		const resolveRelations = String(params.resolve_relations)
		if (json.story) {
			inlineRelations(json.story.content, json.rels, resolveRelations)
		}
		if (json.stories) {
			for (const story of json.stories) {
				inlineRelations(story.content, json.rels, resolveRelations)
			}
		}
	}

	return { data: json }
}
