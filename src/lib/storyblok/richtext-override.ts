/**
 * Rich text rendering with custom/overridden tiptap extensions
 *
 * This approach uses @storyblok/richtext but overrides specific extensions
 * to customize the output. You can change how headings render, add CSS classes,
 * inject wrapper elements, or even produce a completely different format
 * like Markdown instead of HTML.
 *
 * Pros:
 * - Full control over specific nodes while keeping defaults for everything else
 * - Can produce alternative formats (Markdown, plain text, custom XML)
 * - Inherits parsing logic from the original extension
 *
 * Cons:
 * - Requires tiptap extension knowledge
 * - Depends on @storyblok/richtext + tiptap packages
 * - Override API may change between tiptap versions
 */
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import { richTextResolver } from '@storyblok/richtext'

// --- Example 1: Override headings to add Tailwind classes ---

const TailwindHeading = Heading.extend({
	renderHTML({ node, HTMLAttributes }) {
		const level = node.attrs.level as number
		const classes: Record<number, string> = {
			1: 'font-serif text-4xl font-extrabold tracking-tight',
			2: 'font-serif text-3xl font-extrabold tracking-tight',
			3: 'font-serif text-2xl font-bold',
			4: 'font-serif text-xl font-bold',
			5: 'font-serif text-lg font-bold',
			6: 'font-serif text-base font-bold'
		}
		return [`h${level}`, { class: classes[level] || '', ...HTMLAttributes }, 0]
	}
})

// --- Example 2: Override images to add Storyblok image optimization ---

const OptimizedImage = Image.extend({
	renderHTML({ HTMLAttributes }) {
		const src = HTMLAttributes.src
		const optimized = src?.includes('a.storyblok.com') ? `${src}/m/800x0` : src
		return [
			'img',
			{
				...HTMLAttributes,
				src: optimized,
				loading: 'lazy',
				class: 'rounded-xl w-full'
			}
		]
	}
})

// --- Resolver with overrides ---

const { render: renderHtml } = richTextResolver({
	tiptapExtensions: {
		heading: TailwindHeading,
		image: OptimizedImage
	}
})

export function renderRichText(doc: any): string {
	if (!doc) return ''
	return renderHtml(doc) as string
}

// For producing Markdown instead of HTML, see richtext-markdown.ts
// which implements a complete Markdown renderer using the same custom
// tree-walk approach as richtext.ts — no tiptap dependencies needed.
