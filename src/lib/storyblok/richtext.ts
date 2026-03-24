type RichTextNode = {
	type: string
	text?: string
	content?: RichTextNode[]
	attrs?: Record<string, any>
	marks?: { type: string; attrs?: Record<string, any> }[]
}

const markTags: Record<string, (attrs?: Record<string, any>) => [string, string]> = {
	bold: () => ['<b>', '</b>'],
	italic: () => ['<i>', '</i>'],
	strike: () => ['<s>', '</s>'],
	underline: () => ['<u>', '</u>'],
	code: () => ['<code>', '</code>'],
	superscript: () => ['<sup>', '</sup>'],
	subscript: () => ['<sub>', '</sub>'],
	highlight: (attrs) => {
		const color = attrs?.color ? ` style="background-color: ${escapeAttr(attrs.color)}"` : ''
		return [`<mark${color}>`, '</mark>']
	},
	link: (attrs) => {
		const href = attrs?.href || attrs?.url || ''
		const target = attrs?.target ? ` target="${escapeAttr(attrs.target)}"` : ''
		const rel = attrs?.target === '_blank' ? ' rel="noopener noreferrer"' : ''
		return [`<a href="${escapeAttr(href)}"${target}${rel}>`, '</a>']
	},
	textStyle: (attrs) => {
		const color = attrs?.color ? `color: ${escapeAttr(attrs.color)}` : ''
		return color ? [`<span style="${color}">`, '</span>'] : ['', '']
	}
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

function escapeAttr(text: string): string {
	return String(text).replace(/"/g, '&quot;').replace(/&/g, '&amp;')
}

function renderMarks(text: string, marks?: RichTextNode['marks']): string {
	if (!marks?.length) return text
	return marks.reduce((result, mark) => {
		const tagFn = markTags[mark.type]
		if (!tagFn) return result
		const [open, close] = tagFn(mark.attrs)
		return `${open}${result}${close}`
	}, text)
}

function renderNode(node: RichTextNode): string {
	if (node.type === 'text') {
		return renderMarks(escapeHtml(node.text || ''), node.marks)
	}

	const children = node.content?.map(renderNode).join('') ?? ''
	const attrs = node.attrs || {}

	switch (node.type) {
		case 'doc':
			return children
		case 'paragraph':
			return `<p>${children}</p>`
		case 'heading':
			return `<h${attrs.level || 1}>${children}</h${attrs.level || 1}>`
		case 'blockquote':
			return `<blockquote>${children}</blockquote>`
		case 'bullet_list':
			return `<ul>${children}</ul>`
		case 'ordered_list':
			return `<ol>${children}</ol>`
		case 'list_item':
			return `<li>${children}</li>`
		case 'code_block':
			return `<pre><code>${children}</code></pre>`
		case 'horizontal_rule':
			return '<hr>'
		case 'hard_break':
			return '<br>'
		case 'image':
			return `<img src="${escapeAttr(attrs.src || '')}" alt="${escapeAttr(attrs.alt || '')}">`
		default:
			return children
	}
}

export function renderRichText(doc: any): string {
	if (!doc) return ''
	return renderNode(doc)
}
