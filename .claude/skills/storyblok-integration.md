# Storyblok + SvelteKit Custom Integration Skill

Use this skill whenever creating or modifying Storyblok-related code in this SvelteKit project.
This project uses a **fully custom integration with zero Storyblok npm packages**. Everything lives in `src/lib/storyblok/`.

---

## Packages

**None.** No `@storyblok/svelte`, `@storyblok/js`, `@storyblok/richtext`, or `storyblok-js-client`.

Only non-Storyblok packages:
- `vite-plugin-mkcert` — local HTTPS for Visual Editor iFrame

---

## Custom integration modules (`src/lib/storyblok/`)

| Module | Export | Purpose |
|---|---|---|
| `api.ts` | `storyblokFetch(path, params)` | Native `fetch` wrapper + automatic relation inlining |
| `bridge.ts` | `useStoryblokBridge(storyId, callback, options)` | Loads bridge script from CDN, handles live preview events, `preventClicks` intercepts all links |
| `components.ts` | `getComponent(name)` | Component registry + `nonVisualTypes` set for silent skip |
| `editable.ts` | `storyblokEditable` | Svelte action — parses `_editable` comment, adds `data-blok-c`, `data-blok-uid`, `storyblok__outline` |
| `richtext.ts` | `renderRichText(doc)` | Custom rich text to HTML renderer (paragraphs, headings, lists, blockquotes, code, images, marks) |
| `StoryblokComponent.svelte` | `StoryblokComponent` | Dynamic component renderer using `$derived` (reactive to blok changes) |
| `index.ts` | barrel | Re-exports everything above |

All imports use `'$lib/storyblok'`.

---

## Environment variables

```ts
import { PUBLIC_STORYBLOK_TOKEN, PUBLIC_STORYBLOK_REGION, PUBLIC_STORYBLOK_VERSION } from '$env/static/public'
```

```
PUBLIC_STORYBLOK_TOKEN=your_access_token
PUBLIC_STORYBLOK_REGION=eu
PUBLIC_STORYBLOK_VERSION=draft
```

Never use `import.meta.env` — always use SvelteKit's `$env` modules.

---

## API client (`storyblokFetch`)

Native `fetch` wrapper for the Storyblok Content Delivery API v2.
Handles regional base URLs, token injection, query parameter serialization, and **automatic relation inlining**.

### Relation inlining

The Storyblok CDN API returns resolved stories in a `rels` array but does **not** replace UUIDs in content fields. `storyblokFetch` automatically walks the content tree and replaces UUID strings with their resolved story objects using the `resolve_relations` parameter to know which `component.field` pairs to process.

### IMPORTANT: `resolve_relations` format

**Always pass `resolve_relations` as a pre-joined comma string**, not an array:

```ts
const resolveRelations = ['articles_list.articles', 'article.category', 'featured-articles.articles']

// CORRECT — literal commas in the query string
const { data } = await storyblokFetch(`cdn/stories/${slug}`, {
  version: 'draft',
  resolve_relations: resolveRelations.join(',')
})

// WRONG — commas get URL-encoded as %2C, API ignores the parameter
const { data } = await storyblokFetch(`cdn/stories/${slug}`, {
  version: 'draft',
  resolve_relations: resolveRelations  // array — don't do this
})
```

### Examples

```ts
import { storyblokFetch } from '$lib/storyblok'

// Single story with resolved relations
const { data } = await storyblokFetch(`cdn/stories/${slug}`, {
  version: 'draft',
  resolve_relations: 'articles_list.articles,article.category'
})
const story = data.story  // relations are already inlined

// Multiple stories
const { data } = await storyblokFetch('cdn/stories', {
  version: 'draft',
  starts_with: 'drops/',
  sort_by: 'created_at:desc',
  per_page: 50,
})

// With filter_query (serialized as nested query params)
const { data } = await storyblokFetch('cdn/stories', {
  version: 'draft',
  content_type: 'article',
  filter_query: {
    category: { in: story.uuid }
  }
})
```

Regional base URLs resolved from `PUBLIC_STORYBLOK_REGION`:
- `eu` → `https://api.storyblok.com`
- `us` → `https://api-us.storyblok.com`
- `ap` → `https://api-ap.storyblok.com`
- `ca` → `https://api-ca.storyblok.com`
- `cn` → `https://app.storyblokchina.cn`

---

## Component registry

All Storyblok blok components must be registered in `src/lib/storyblok/components.ts`:

```ts
const components: Record<string, Component<any>> = {
  page: Page,
  // key = lowercase Storyblok component name
  // value = PascalCase Svelte component
}

// Content types that don't have visual components (e.g., config)
const nonVisualTypes = new Set(['config'])
```

When adding a new Storyblok component:
1. Create `src/lib/components/storyblok/MyComponent.svelte`
2. Add the mapping in `components.ts`

For non-visual content types (used only for data, like `config`), add to `nonVisualTypes` instead.

---

## Layout and spacing architecture

### Page.svelte owns the container

`Page.svelte` provides `max-w-3xl mx-auto px-6 md:px-12 py-8 lg:py-16` and `space-y-12 lg:space-y-16` for vertical rhythm between child bloks.

**Child bloks rendered inside Page** (Teaser, Hero, Grid, ArticlesList, FeaturedArticles, CategoriesList) must NOT add their own container, padding, or max-width — only internal layout.

**Standalone page components** (Article, ArticleCategory) own their own container because they render directly via `StoryblokComponent` in `+page.svelte`, not inside a Page blok.

---

## Routing (catch-all)

| URL | Storyblok slug |
|---|---|
| `/` | `home` |
| `/about` | `about` |
| `/articles/myarticle` | `articles/myarticle` |

Empty `params.slug` (root `/`) defaults to `'home'`.

---

## Data fetching

All data fetching happens in `+page.ts` or `+layout.ts` using `storyblokFetch`.

### Loader-injected fields

Some content types need extra data fetched via separate API calls. These are injected as `_`-prefixed fields on `story.content`:

- `story.content._categories` — for `categories-list` pages
- `story.content._articles` — for `article-category` pages

These fields do **not** exist in Storyblok — they are added by the loader. The bridge will not include them.

### Config story

The `config` story is loaded in `+layout.ts` and provides:
- `title` — site name (used in Navbar and Footer)
- `tagline` — shown below the title in Navbar
- `description` — shown in Footer
- `copyright` — footer copyright text
- `nav_links` — navigation links array
- `links` — footer links array

---

## Storyblok Bridge (live preview)

Custom implementation in `bridge.ts`. Loads the bridge script from `https://app.storyblok.com/f/storyblok-v2-latest.js` and handles events directly — no SDK URL guards.

Key rules:
- Use `$effect` with `browser` guard (not `onMount`) — re-runs on navigation
- Reset `bridgeContent = null` at the start of each effect
- **Preserve loader-injected fields** (`_categories`, `_articles`) when merging bridge content
- Use `{#key story?.id}` to force `StoryblokComponent` remount on navigation
- `preventClicks: true` adds a document-level click listener that prevents all `<a>` navigation in the Visual Editor
- Bridge events: `input` → updates content reactively, `change`/`published` → reloads the page

---

## Dynamic component rendering

`StoryblokComponent` uses `$derived` for the component lookup — correctly updates when `blok.component` changes on navigation.

Every blok component must:
- Use `use:storyblokEditable={blok}` on its root element
- Use `(item._uid)` as key in `{#each}` blocks

---

## Rich text rendering

Custom renderer in `richtext.ts` — zero dependencies. Handles:
- Block nodes: paragraph, heading (h1–h6), blockquote, bullet_list, ordered_list, list_item, code_block, horizontal_rule, hard_break, image
- Marks: bold, italic, strike, underline, code, superscript, subscript, highlight, link, textStyle
- HTML escaping for security

```ts
import { renderRichText } from '$lib/storyblok'
const html = renderRichText(blok.richtext_field)
```

---

## API options reference

| Option | Type | Description |
|---|---|---|
| `version` | string | `'draft'` or `'published'` |
| `resolve_relations` | string | Comma-separated `component.field` paths (**must be string, not array**) |
| `resolve_links` | string | `'url'`, `'story'`, or `'link'` |
| `language` | string | Language code for i18n content |
| `per_page` | number | Pagination — items per page (max 100) |
| `page` | number | Pagination — page number |
| `starts_with` | string | Filter stories by slug prefix |
| `sort_by` | string | Sort field (e.g. `'created_at:desc'`) |
| `search_term` | string | Full-text search |
| `content_type` | string | Filter by content type |
| `filter_query` | object | Nested filter (serialized as `filter_query[field][op]=value`) |

---

## Common gotchas

1. **`resolve_relations` must be a comma string** — arrays get URL-encoded commas (`%2C`) which the API ignores. Always use `.join(',')`.
2. **Relations are not auto-inlined** — the CDN API returns resolved stories in `rels`, not in the content. `storyblokFetch` handles inlining automatically.
3. **HTTPS required locally** — Visual Editor won't load HTTP iFrames. Always use `vite-plugin-mkcert`.
4. **Bridge only on client** — guard with `browser` from `$app/environment`.
5. **Relations must be passed to bridge too** — pass the same `resolveRelations` array to bridge options.
6. **Component names are lowercase** — Storyblok uses `page`, Svelte uses `Page`. The mapping in `components.ts` handles this.
7. **Non-visual types need `nonVisualTypes`** — add content types like `config` to the set to suppress "not found" errors.
8. **Loader-injected fields disappear on bridge update** — always merge `_categories` and `_articles` from `story.content` when bridge content is active.
9. **Use `{#key story?.id}`** — forces `StoryblokComponent` to remount on navigation.
10. **Use `$effect` not `onMount` for bridge** — `onMount` only fires once; `$effect` re-runs when `story` changes.
11. **Page owns the container** — child bloks inside Page must not add their own `max-w-3xl`, `px-*`, or `py-*`.
12. **`preventClicks` intercepts all links** — the bridge adds a document-level click listener when enabled.
