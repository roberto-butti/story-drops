# Story Drops

A **SvelteKit** blog integrated with **Storyblok** as headless CMS, styled with **TailwindCSS**.

Built with full Visual Editor support, the Storyblok bridge updates only the content that changed, not the whole page. Editors see their changes in real time as they type.

## Stack

- **SvelteKit** (Svelte 5) with TypeScript
- **Storyblok** as headless CMS with Visual Editor live preview
- **TailwindCSS v4** with Typography and Forms plugins
- **Inter** (Google Fonts) + system serif
- **bun** as package manager
- **adapter-static** for SSG

## Getting started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Storyblok access token

# Start dev server (HTTPS required for Storyblok Visual Editor)
bun dev
```

### Environment variables

```
PUBLIC_STORYBLOK_TOKEN=    # Storyblok access token
PUBLIC_STORYBLOK_REGION=   # eu | us | ap | ca | cn
PUBLIC_STORYBLOK_VERSION=  # draft | published
```

## Storyblok integration

The integration lives in `src/lib/storyblok/` and handles everything needed to work with Storyblok's Content Delivery API and Visual Editor:

| Module | What it does |
|---|---|
| `api.ts` | Fetches stories from the Content Delivery API, resolves relations and inlines them into content |
| `bridge.ts` | Connects to the Storyblok bridge for real-time Visual Editor updates |
| `components.ts` | Maps Storyblok component names to Svelte components |
| `editable.ts` | Svelte action that enables click-to-edit in the Visual Editor |
| `richtext.ts` | Renders rich text fields to HTML |
| `StoryblokComponent.svelte` | Dynamically renders the right Svelte component for each Storyblok blok |

### How the Visual Editor works

The bridge listens for changes from the Storyblok editor and updates only the affected content reactively. When an editor modifies a headline, only that headline re-renders — no full page reload needed. Relations resolved at load time (like article lists) are preserved during editing.

### Rich text rendering — four approaches

Storyblok stores rich text as structured JSON (TipTap format). This project includes four different strategies to render it, each in its own file:

1. **Custom HTML renderer** (`richtext.ts`) — Walks the JSON tree and produces HTML directly. Full control over every tag, no external packages needed.

2. **Official package** (`richtext-package.ts`) — Uses `@storyblok/richtext` for out-of-the-box rendering. All node types and marks supported automatically.

3. **Package with overrides** (`richtext-override.ts`) — Same official package, but with custom tiptap extensions to control the output per node — for example adding Tailwind classes to headings or optimizing Storyblok images.

4. **Markdown renderer** (`richtext-markdown.ts`) — Same tree walk as option 1, but outputs Markdown instead of HTML. Useful when the consumer is an AI model, a mobile app, or any client that prefers Markdown over HTML.

Switch between them by changing one line in `index.ts`. The article page includes a "Show Markdown" button that renders the content with option 4 in a popup — a live demo of multi-format output from the same source.


## Project structure

```
src/
  lib/
    storyblok/            # Storyblok integration modules
    components/
      storyblok/          # Blok components (1:1 with Storyblok)
  routes/
    +layout.svelte        # Root layout (Navbar + Footer from config story)
    +layout.ts            # Loads config story
    [...slug]/
      +page.svelte        # Catch-all route with bridge support
      +page.ts            # Loads story by slug, resolves relations
```

## AI-assisted development

This project uses `CLAUDE.md` and `.claude/skills/` to provide structured context for AI coding tools like Claude Code.

- **`CLAUDE.md`** — Project overview, stack, design system, conventions, boundaries
- **`.claude/skills/storyblok-integration.md`** — Detailed reference for the Storyblok integration

These files ensure consistency when AI tools add features or refactor code — the conventions, design tokens, and architecture decisions are documented once and applied automatically.

## Building

```bash
bun run build     # Build for production (SSG)
bun run preview   # Preview the build locally
bun run check     # Type check
bun run format    # Format with Prettier
```
