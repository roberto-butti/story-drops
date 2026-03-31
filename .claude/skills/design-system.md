# Design System

Use this skill whenever creating or styling components, adjusting layout, or making visual decisions in this project.

---

## Colors

Defined in `src/routes/layout.css` via `@theme`:

| Token | Value | Usage |
|---|---|---|
| `brand-ink` | `#111827` (gray-900) | Primary text, headings |
| `brand-deep` | `#030712` (gray-950) | Hover states on dark backgrounds |
| `brand-muted` | `#6B7280` (gray-500) | Secondary text, metadata |
| `brand-sand` | `#E5E7EB` (gray-200) | Borders, dividers |
| `brand-paper` | `#FFFFFF` | Backgrounds |
| `brand-accent` | `#2563EB` (blue-600) | Links, CTAs, category badges, hover accents |

Use `bg-gray-50` for alternating section backgrounds (e.g., FeaturedArticles, Footer).

---

## Typography

### Fonts

- **Sans-serif**: Inter (loaded from Google Fonts) — `font-sans`
- **Serif**: system serif (Georgia) — `font-serif`
- **Monospace**: JetBrains Mono (loaded from Google Fonts) — `font-mono`

Fonts are loaded non-blocking in `src/app.html` via `preload` + `media="print" onload`.

### Heading scale

- **H1 (article/category)**: `text-3xl font-extrabold leading-tight text-brand-ink lg:text-4xl`
- **H1 (hero)**: `text-4xl font-extrabold leading-tight text-brand-ink lg:text-5xl`
- **H2**: `text-2xl font-bold leading-tight text-brand-ink`
- **H3**: `text-xl font-bold leading-tight text-brand-ink`
- **Body**: `font-sans text-base leading-relaxed` (Inter)
- **Small/meta**: `font-sans text-sm text-brand-muted`
- **Labels**: `font-sans text-xs text-brand-muted`

### Prose (rich text content)

```
prose prose-base sm:prose-base lg:prose-lg max-w-none text-brand-ink
prose-headings:font-extrabold prose-headings:leading-tight prose-headings:text-brand-ink
prose-a:text-brand-accent prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline
prose-img:rounded-lg prose-blockquote:border-brand-accent
```

---

## Spacing

### Page container (owned by Page.svelte)

```
mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16
```

Vertical rhythm between child bloks:

```
space-y-12 lg:space-y-16
```

### Standalone pages (Article, ArticleCategory, CategoriesList)

```
mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24
```

### Standard horizontal padding (consistent everywhere)

```
px-4 sm:px-6 lg:px-8
```

Used by: Page, Article, ArticleCategory, CategoriesList, Navbar, Footer.

### Section internal spacing

`space-y-6` between heading and content within a section.

---

## Component patterns

### Article cards (grid view)

```svelte
<article>
  <a href={url}>
    <img src={...} width="600" height="400" loading="lazy"
         class="w-full rounded-lg mb-5 aspect-video object-cover" />
  </a>
  <h3 class="text-xl font-bold leading-tight text-brand-ink mb-2">
    <a href={url} class="hover:underline">Title</a>
  </h3>
  <p class="text-sm text-brand-muted mb-4 leading-relaxed">Subheadline</p>
  <a href={url}
     class="inline-flex items-center font-medium text-sm underline underline-offset-4 text-brand-accent hover:no-underline">
    Read more<span class="sr-only">: Title</span>
  </a>
</article>
```

Grid: `grid grid-cols-1 gap-12 sm:grid-cols-2`

### Article cards (list view)

```svelte
<article class="flex gap-5 py-6 first:pt-0 last:pb-0">
  <a href={url} class="shrink-0">
    <img src={.../m/160x0} width="160" loading="lazy"
         class="w-28 sm:w-40 rounded-lg object-cover aspect-[4/3]" />
  </a>
  <div class="min-w-0">
    <h3 class="text-lg font-bold leading-tight text-brand-ink mb-1">...</h3>
    <p class="text-sm text-brand-muted mb-3 leading-relaxed line-clamp-2">...</p>
    <a href={url} class="... underline underline-offset-4 text-brand-accent hover:no-underline">Read more</a>
  </div>
</article>
```

List container: `divide-y divide-brand-sand`

### Buttons

- **Primary CTA**: `bg-brand-accent text-white font-bold rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors`

### Category badges

```
rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-brand-accent
```

Hover: `hover:bg-blue-100 transition-colors`

### Links (Flowbite style)

```
underline underline-offset-4 text-brand-accent hover:no-underline
```

### Featured section background

```
bg-gray-50 rounded-lg p-6 md:p-8
```

---

## Images

### Cover image (article page — LCP element)

```svelte
<img src={.../m/900x500} width="900" height="500" fetchpriority="high"
     class="w-full rounded-lg object-cover" />
```

### Card images (lazy loaded)

```svelte
<img src={.../m/600x400} width="600" height="400" loading="lazy"
     class="w-full rounded-lg aspect-video object-cover" />
```

### List view thumbnails

```svelte
<img src={.../m/160x0} width="160" loading="lazy"
     class="w-28 sm:w-40 rounded-lg object-cover aspect-[4/3]" />
```

Use Storyblok's image service (`/m/WIDTHxHEIGHT`) for resizing. `/m/160x0` = width 160, auto height (honors focus point).

---

## Visual Editor outline

`.storyblok__outline` CSS class added by the `storyblokEditable` action. Styled in `layout.css`:

```css
.storyblok__outline { position: relative; }
.storyblok__outline:hover {
  outline: 2px dashed #09b3af;
  outline-offset: 2px;
  cursor: pointer;
}
```

---

## Syntax highlighting

Code blocks use Shiki with the `one-dark-pro` theme. Styled in `layout.css`:

```css
pre.shiki {
  font-size: 1rem;
  line-height: 1.75;
  padding: 1.25rem 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
```

Font: JetBrains Mono (`font-mono`).
