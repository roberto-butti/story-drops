/**
 * Rich text rendering using @storyblok/richtext
 *
 * This approach uses Storyblok's official package to convert the structured
 * JSON from rich text fields into HTML. The package handles all node types
 * and marks out of the box — no manual mapping needed.
 *
 * Pros:
 * - Zero manual node/mark mapping — all standard types are supported
 * - Maintained by Storyblok — stays in sync with the editor
 * - Handles edge cases (nested marks, empty nodes, etc.)
 *
 * Cons:
 * - Adds @storyblok/richtext + tiptap as dependencies (~30+ packages)
 * - Tiptap version conflicts can break builds (e.g. v3.10 vs v3.20 dist change)
 * - Less control over the exact HTML output
 */
import { richTextResolver } from '@storyblok/richtext'

const { render } = richTextResolver()

export function renderRichText(doc: any): string {
	if (!doc) return ''
	return render(doc) as string
}
