import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Highlighter | null = null

async function getHighlighter(): Promise<Highlighter> {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ['tokyo-night'],
			langs: [
				'javascript',
				'typescript',
				'html',
				'css',
				'json',
				'bash',
				'svelte',
				'markdown',
				'yaml',
				'xml'
			]
		})
	}
	return highlighter
}

/**
 * Post-processes HTML from renderRichText to add syntax highlighting
 * to code blocks. Finds <pre><code class="language-xxx"> blocks and
 * replaces them with Shiki-highlighted HTML.
 *
 * Runs during SSR/SSG — produces inline-styled HTML, zero client JS.
 */
export async function highlightCodeBlocks(html: string): Promise<string> {
	if (!html) return html

	const hl = await getHighlighter()
	const loadedLangs = hl.getLoadedLanguages()

	return html.replace(
		/<pre(?:\s+class="language-(\w+)")?><code>([\s\S]*?)<\/code><\/pre>/g,
		(_, lang, code) => {
			const decoded = code
				.replace(/&amp;/g, '&')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&quot;/g, '"')
				.replace(/&#0?39;/g, "'")
				.replace(/&#x27;/g, "'")
				.replace(/&apos;/g, "'")

			const language = lang && loadedLangs.includes(lang) ? lang : 'text'

			try {
				return hl.codeToHtml(decoded, {
					lang: language,
					theme: 'tokyo-night'
				})
			} catch {
				return `<pre><code>${code}</code></pre>`
			}
		}
	)
}
