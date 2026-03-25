import type { Component } from 'svelte'
import Page from '$lib/components/storyblok/Page.svelte'
import Teaser from '$lib/components/storyblok/Teaser.svelte'
import Grid from '$lib/components/storyblok/Grid.svelte'
import Feature from '$lib/components/storyblok/Feature.svelte'
import Hero from '$lib/components/storyblok/Hero.svelte'
import ArticlesList from '$lib/components/storyblok/ArticlesList.svelte'
import Article from '$lib/components/storyblok/Article.svelte'
import ArticleCategory from '$lib/components/storyblok/ArticleCategory.svelte'
import CategoriesList from '$lib/components/storyblok/CategoriesList.svelte'
import FeaturedArticles from '$lib/components/storyblok/FeaturedArticles.svelte'
import TextSection from '$lib/components/storyblok/TextSection.svelte'
import LatestArticles from '$lib/components/storyblok/LatestArticles.svelte'

const components: Record<string, Component<any>> = {
	page: Page,
	teaser: Teaser,
	grid: Grid,
	feature: Feature,
	hero: Hero,
	articles_list: ArticlesList,
	article: Article,
	'article-category': ArticleCategory,
	categories_list: CategoriesList,
	'categories-list': CategoriesList,
	'featured-articles': FeaturedArticles,
	'text-section': TextSection,
	'latest-articles': LatestArticles
}

const nonVisualTypes = new Set(['config'])

export function getComponent(name: string): Component<any> | null {
	const component = components[name]
	if (!component && !nonVisualTypes.has(name)) {
		console.error(`Component "${name}" not found in Storyblok component registry.`)
	}
	return component ?? null
}
