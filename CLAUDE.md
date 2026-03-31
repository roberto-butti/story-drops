# CLAUDE.md — Story Drops

This file instructs Claude on how to work in this SvelteKit project.
Read it fully before generating any code, component, or content.

---

## Project overview

**Story Drops** is an opinionated blog for Storyblok developers and power editors.
Each article is a "drop" — a focused, self-contained tip with context, trade-offs, pros/cons, and links to official Storyblok docs.

The frontend is a **SvelteKit** project. Content is managed in **Storyblok as the CMS**.
Styling uses **TailwindCSS**. The Storyblok integration is fully custom — zero Storyblok packages, native `fetch` with relation inlining, custom bridge, custom rich text renderer.

---

## Stack

- **Framework**: SvelteKit (latest, Svelte 5)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 — utility-first, no custom CSS unless strictly necessary
- **Font**: Inter (Google Fonts) for sans-serif, system serif (Georgia) for headings
- **CMS**: Storyblok — all drops (articles) are Storyblok stories
- **Storyblok integration**: Fully custom — `src/lib/storyblok/` (zero Storyblok npm packages)
- **Package Manager**: bun
- **Add-ons**: prettier, @tailwindcss/typography, @tailwindcss/forms, adapter-static
- **Rendering**: SSG preferred for drop pages, SSR allowed for dynamic routes

---

## Available MCP Tools

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation.

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

## Project structure conventions

```
src/
  lib/
    storyblok/              # Custom Storyblok integration (zero npm dependencies)
      api.ts                # storyblokFetch — fetch wrapper + relation inlining
      bridge.ts             # useStoryblokBridge — loads bridge script, handles live preview
      components.ts         # Component registry + nonVisualTypes set
      editable.ts           # storyblokEditable — Svelte action for Visual Editor
      richtext.ts           # renderRichText — custom rich text to HTML renderer
      StoryblokComponent.svelte  # Dynamic component renderer (uses $derived)
      index.ts              # Barrel export
    components/
      storyblok/            # Storyblok blok components (mapped 1:1 to Storyblok components)
    utils/                  # Helper functions (slug, date, api)
  routes/
    +layout.svelte          # Root layout (white bg, Navbar + Footer from config)
    +layout.ts              # Loads config story for Navbar/Footer
    [...slug]/
      +page.svelte          # Catch-all: renders any Storyblok story
      +page.ts              # Catch-all: loads story by slug (/ → "home")
  app.html                  # Loads Inter font from Google Fonts
```

- One component per file. Filename matches Storyblok component name in PascalCase.
- Storyblok blok components live in `src/lib/components/storyblok/`.
- Keep data fetching in `+page.ts` or `+layout.ts`, never inside `.svelte` components.
- No inline scripts. No `<style>` blocks unless Tailwind cannot cover it.
- All Storyblok utilities are imported from `$lib/storyblok` (barrel export).

---

## Design system

> Full design system reference: `.claude/skills/design-system.md`

Key tokens: `brand-ink` (gray-900), `brand-accent` (blue-600), `brand-muted` (gray-500), `brand-sand` (gray-200). Fonts: Inter (sans), Georgia (serif), JetBrains Mono (code). Standard padding: `px-4 sm:px-6 lg:px-8`. Page container: `max-w-3xl`. Article content: `max-w-2xl`.

---

## Storyblok conventions

> Full integration reference: `.claude/skills/storyblok-integration.md`

- Use the **Content Delivery API v2** via `storyblokFetch()` from `$lib/storyblok` — native `fetch`, no SDK.
- **`resolve_relations` must be passed as a pre-joined comma string**, not an array — e.g. `resolveRelations.join(',')`. The API rejects URL-encoded commas.
- `storyblokFetch` **automatically inlines resolved relations** from the `rels` array into story content. The Storyblok CDN API returns resolved stories in `rels` but does not replace UUIDs in content — our `inlineRelations()` function handles this.
- Register all blok components in `src/lib/storyblok/components.ts`. Non-visual content types (e.g., `config`) go in the `nonVisualTypes` set to suppress console errors.
- **Page.svelte owns the container** (`max-w-3xl`, padding, vertical rhythm). Child bloks rendered inside Page should NOT add their own container/padding.
- **Article.svelte and ArticleCategory.svelte** are standalone pages — they own their own container.
- The `config` story provides `title`, `tagline`, `description`, `copyright`, `nav_links`, and `links` for Navbar and Footer.
- Use `StoryblokComponent` for dynamic rendering of bloks. Use `renderRichText` for rich text fields.
- Use `storyblokEditable` action on every blok component root element for Visual Editor click-to-edit.
- Enable the **Storyblok Bridge** (`useStoryblokBridge`) for live preview — called inside `$effect` with a `browser` guard.
- The bridge's `preventClicks: true` option intercepts all `<a>` clicks to prevent navigation in the Visual Editor.
- When the bridge updates content, **preserve loader-injected fields** (`_categories`, `_articles`).
- Routing uses a **catch-all** `[...slug]` route — URL path maps directly to Storyblok `full_slug`. Root `/` defaults to `home`.
- Content version is controlled by `PUBLIC_STORYBLOK_VERSION` env var (`draft` or `published`).
- Import env vars via `$env/static/public` (SvelteKit convention), not `import.meta.env`.
- Local dev must serve HTTPS (`vite-plugin-mkcert`) for the Visual Editor iFrame.

---

## Component authoring rules

- Always use Tailwind utility classes. Do not write custom CSS unless a utility does not exist.
- Follow the design system above for colors, typography, and spacing.
- Components receive data as props — never fetch inside a component.
- Use Svelte `{#if}`, `{#each}`, `{#await}` blocks idiomatically.
- Avoid unnecessary wrappers. Keep the DOM lean.
- Accessible markup always: semantic HTML, `alt` on images, `aria-label` where needed.
- No `!important`. No hardcoded colors outside of Tailwind classes.

---

## Content authoring rules (drops)

Each drop article must follow this structure — both in Storyblok schema and in rendered output:

1. **Drop number + title** — e.g. `Drop #02 — Handling slugs in multilanguage spaces`
2. **Context** — what problem this addresses and in what scenario
3. **The suggestion** — the concrete recommendation
4. **How to apply it** — practical steps or code
5. **Pros** — what this approach does well
6. **Cons** — where it falls short or creates friction
7. **When to use it** — the scenarios where this fits
8. **When NOT to use it** — equally important
9. **Official docs reference** — link to Storyblok documentation when relevant

Every drop is opinionated but balanced. Never present a solution as universal.
Always acknowledge trade-offs. Readers are experienced — do not over-explain basics.

---

## Tone and writing style

> Full writing style guide: `.claude/skills/writing-style.md`

- Professional but approachable. Write like a solution engineer, not a marketer or a professor.
- No marketing language. No "powerful", "seamless", "robust", "revolutionary", "cutting-edge".
- Short sentences, short paragraphs (3–4 lines max). One idea per paragraph.
- Follow Problem → Solution → Impact structure for explanations.
- Code examples should be minimal and illustrative, not production-complete boilerplate.
- Reference official Storyblok docs rather than duplicating them.
- Target audience: developers, solution engineers, technical architects, CTOs.

---

## Environment variables

```
PUBLIC_STORYBLOK_TOKEN=    # Storyblok access token (set per environment)
PUBLIC_STORYBLOK_REGION=   # eu | us | ap | ca | cn
PUBLIC_STORYBLOK_VERSION=  # draft | published (controls content version)
```

---

## What Claude should NOT do in this project

- Do not install or suggest `@storyblok/svelte`, `@storyblok/js`, or `@storyblok/richtext` — this project uses a fully custom integration with zero Storyblok packages.
- Do not install or suggest libraries outside the defined stack without explaining why.
- Do not write custom CSS when a Tailwind utility exists.
- Do not hardcode content — everything comes from Storyblok.
- Do not generate placeholder/lorem ipsum content for drops — drops are real, opinionated articles.
- Do not skip pros/cons or "when not to use" sections in any drop article.
- Do not use the Storyblok Management API on the frontend — management operations are scripts only.
- Do not add container/padding/max-width to blok components rendered inside Page — Page owns the layout.
