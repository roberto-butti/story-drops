/**
 * Rich text rendering to Markdown
 *
 * Converts Storyblok's structured JSON (TipTap document format) into
 * Markdown instead of HTML. Same recursive tree walk as richtext.ts,
 * but the output is plain text with Markdown formatting.
 *
 * Use cases:
 * - AI/LLM consumption — models work better with Markdown than HTML
 * - Mobile apps with native Markdown renderers
 * - Documentation pipelines (e.g. generating .md files from CMS content)
 * - Email templates where HTML is too heavy
 * - Search indexing where you want formatted plain text
 * - RSS feeds or API responses where clients choose their own rendering
 *
 * Pros:
 * - Zero dependencies
 * - Lightweight, portable output
 * - Consumers can re-render Markdown into any format they need
 *
 * Cons:
 * - Markdown can't express everything HTML can (text color, highlight, alignment)
 * - Nested lists require careful indentation tracking
 * - Some marks (underline, superscript, subscript) have no standard Markdown equivalent
 */

type RichTextNode = {
	type: string
	text?: string
	content?: RichTextNode[]
	attrs?: Record<string, any>
	marks?: { type: string; attrs?: Record<string, any> }[]
}

function renderMarks(text: string, marks?: RichTextNode['marks']): string {
	if (!marks?.length) return text
	return marks.reduce((result, mark) => {
		switch (mark.type) {
			case 'bold':
				return `**${result}**`
			case 'italic':
				return `*${result}*`
			case 'strike':
				return `~~${result}~~`
			case 'code':
				return `\`${result}\``
			case 'link': {
				const href = mark.attrs?.href || mark.attrs?.url || ''
				return `[${result}](${href})`
			}
			case 'superscript':
				return `^${result}^`
			case 'subscript':
				return `~${result}~`
			// Marks with no Markdown equivalent — pass through as plain text
			case 'underline':
			case 'highlight':
			case 'textStyle':
			default:
				return result
		}
	}, text)
}

function renderNode(node: RichTextNode, indent = 0): string {
	if (node.type === 'text') {
		return renderMarks(node.text || '', node.marks)
	}

	const children = (content?: RichTextNode[]) =>
		content?.map((child) => renderNode(child, indent)).join('') ?? ''

	const attrs = node.attrs || {}

	switch (node.type) {
		case 'doc':
			return (
				node.content
					?.map((child) => renderNode(child, indent))
					.join('\n\n')
					.trim() ?? ''
			)

		case 'paragraph':
			return children(node.content)

		case 'heading': {
			const level = attrs.level || 1
			const prefix = '#'.repeat(level)
			return `${prefix} ${children(node.content)}`
		}

		case 'blockquote': {
			const inner = node.content?.map((child) => renderNode(child, indent)).join('\n\n') ?? ''
			return inner
				.split('\n')
				.map((line) => `> ${line}`)
				.join('\n')
		}

		case 'bullet_list':
			return (
				node.content
					?.map((child) => renderNode(child, indent))
					.join('\n') ?? ''
			)

		case 'ordered_list':
			return (
				node.content
					?.map((child, i) => {
						const text = renderNode(child, indent)
						// Replace the leading "- " with "N. "
						return text.replace(/^(\s*)- /, `$1${i + 1}. `)
					})
					.join('\n') ?? ''
			)

		case 'list_item': {
			const prefix = ' '.repeat(indent)
			const inner = node.content?.map((child) => renderNode(child, indent + 2)).join('\n') ?? ''
			return `${prefix}- ${inner}`
		}

		case 'code_block': {
			const lang = attrs.language || ''
			const code = children(node.content)
			return `\`\`\`${lang}\n${code}\n\`\`\``
		}

		case 'horizontal_rule':
			return '---'

		case 'hard_break':
			return '  \n'

		case 'image': {
			const alt = attrs.alt || ''
			const src = attrs.src || ''
			return `![${alt}](${src})`
		}

		default:
			return children(node.content)
	}
}

export function renderRichTextToMarkdown(doc: any): string {
	if (!doc) return ''
	return renderNode(doc)
}
