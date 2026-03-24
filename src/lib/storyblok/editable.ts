export function storyblokEditable(node: HTMLElement, blok: any) {
	const apply = (blok: any) => {
		if (!blok?._editable) return

		const match = blok._editable.match(/<!--#storyblok#(.+?)-->/)
		if (!match) return

		const data = match[1]
		node.setAttribute('data-blok-c', data)
		node.setAttribute('data-blok-uid', JSON.parse(data).uid)
		node.classList.add('storyblok__outline')
	}

	apply(blok)
	return { update: apply }
}
