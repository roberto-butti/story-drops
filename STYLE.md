# STYLE.md — Story Drops design system

This file defines the visual identity of Story Drops.
All frontend components must follow these rules for consistency.

---

## Brand identity

**Name**: Story Drops
**Tagline**: Opinionated Storyblok tips for developers and power editors
**Series unit**: each article is a "drop", numbered sequentially (`Drop #01`, `Drop #02`...)
**Siblings**: *Some Drops of JavaScript* — same philosophy, different audience

---

## Logo

The Story Drops mascot is a water drop with two almond-shaped eyes (pupils + light reflex),
giving it a curious, attentive personality. It reads as a drop first, a face second.

### SVG source (canonical)

```svg
<!-- Full detail — use at 36px and above -->
<svg viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg">
  <!-- body -->
  <path d="M24 3 C24 3, 5 28, 5 40 A19 19 0 0 0 43 40 C43 28 24 3 24 3Z" fill="#4A3728"/>
  <!-- left eye -->
  <ellipse cx="17" cy="38" rx="3.5" ry="4.5" fill="#F5EDE4"/>
  <ellipse cx="17.8" cy="37.2" rx="1.8" ry="2.2" fill="#2A1F17"/>
  <ellipse cx="18.6" cy="36.4" rx="0.7" ry="0.7" fill="#F5EDE4" opacity="0.9"/>
  <!-- right eye -->
  <ellipse cx="31" cy="38" rx="3.5" ry="4.5" fill="#F5EDE4"/>
  <ellipse cx="31.8" cy="37.2" rx="1.8" ry="2.2" fill="#2A1F17"/>
  <ellipse cx="32.6" cy="36.4" rx="0.7" ry="0.7" fill="#F5EDE4" opacity="0.9"/>
  <!-- light reflex on body -->
  <ellipse cx="34" cy="22" rx="3" ry="5" fill="#C8B49A" opacity="0.35" transform="rotate(-20 34 22)"/>
</svg>

<!-- Simplified — use at 24px -->
<!-- Remove light reflex and eye highlights, keep whites + pupils only -->

<!-- Favicon — use at 16px -->
<!-- Keep body + whites only, drop all pupils and reflex -->
```

### Logo + wordmark
- Icon left, text right, vertically centered
- Gap between icon and text: `gap-4` (16px)
- Wordmark: serif font, `text-3xl font-medium` in `brand-ink`
- Tagline below wordmark: sans-serif, `text-xs uppercase tracking-widest` in `brand-muted`

### Dark surface variant
- Body fill becomes `#C8B49A` (warm sand)
- Eye whites become `#2A1F17` (deep brown)
- Pupils become `#4A3728`
- Reflex becomes `#F5EDE4` at 20% opacity

---

## Color palette

Story Drops uses a warm ink-and-paper palette. All colors are defined as Tailwind CSS custom tokens.

### Tailwind config additions

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      brand: {
        ink:     '#4A3728',   // primary — drop body, headings, strong text
        deep:    '#2A1F17',   // darkest — drop shadow, dark bg
        muted:   '#8C7B6B',   // secondary text, taglines
        sand:    '#C8B49A',   // light accents, borders, badges
        paper:   '#F5EDE4',   // lightest — backgrounds, eye whites
      }
    },
    fontFamily: {
      sans:  ['your-sans', 'system-ui', 'sans-serif'],
      serif: ['your-serif', 'Georgia', 'serif'],
    }
  }
}
```

### Color usage rules

| Token           | Usage |
|-----------------|-------|
| `brand-ink`     | Headings, logo text, strong UI elements, drop body fill |
| `brand-deep`    | Dark backgrounds, deep shadows, darkest text |
| `brand-muted`   | Secondary text, metadata, taglines, captions |
| `brand-sand`    | Borders, dividers, badges, pill backgrounds, subtle accents |
| `brand-paper`   | Page background, card backgrounds, light surface fills |

Never use raw hex values in components — always use the token classes.

---

## Typography

### Scale

| Role            | Tailwind classes                              |
|-----------------|-----------------------------------------------|
| Display / hero  | `font-serif text-5xl font-medium`             |
| H1              | `font-serif text-4xl font-medium`             |
| H2              | `font-serif text-2xl font-medium`             |
| H3              | `font-sans text-lg font-medium`               |
| Body            | `font-sans text-base leading-relaxed`         |
| Small / meta    | `font-sans text-sm text-brand-muted`          |
| Label / badge   | `font-sans text-xs uppercase tracking-widest` |
| Code inline     | `font-mono text-sm`                           |
| Code block      | `font-mono text-sm leading-relaxed`           |

### Rules
- Headings use serif. UI elements and body use sans.
- Two weights only: `font-normal` (400) and `font-medium` (500). Never `font-bold` or `font-semibold`.
- Sentence case always. Never title case or all-caps in headings.
- Line length: prose content max `max-w-2xl` (65ch). Never full-width text blocks.

---

## Spacing

Use Tailwind spacing scale consistently:

| Context                        | Value      |
|-------------------------------|------------|
| Page horizontal padding        | `px-6 md:px-12` |
| Section vertical rhythm        | `py-16`    |
| Card internal padding          | `p-6`      |
| Component gap (siblings)       | `gap-4`    |
| Prose paragraph gap            | `mb-5`     |
| Heading above content          | `mb-3`     |

---

## Components

### Drop badge
Used in article headers to identify the drop number.

```svelte
<!-- DropBadge.svelte -->
<span class="inline-flex items-center gap-2 bg-brand-paper border border-brand-sand
             rounded-full px-4 py-1.5">
  <DropIcon size={16} />
  <span class="font-sans text-xs font-medium text-brand-ink tracking-wide">
    Drop #{number}
  </span>
</span>
```

### Article card (drop preview)
Used on the homepage list.

```svelte
<article class="border border-brand-sand rounded-xl p-6 bg-brand-paper
                hover:border-brand-muted transition-colors">
  <DropBadge number={drop.number} />
  <h2 class="font-serif text-xl font-medium text-brand-ink mt-3 mb-2">
    {drop.title}
  </h2>
  <p class="font-sans text-sm text-brand-muted leading-relaxed">
    {drop.excerpt}
  </p>
</article>
```

### Pros / Cons block
Every drop article must render this block.

```svelte
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
  <div class="rounded-xl border border-brand-sand p-5">
    <p class="text-xs uppercase tracking-widest text-brand-muted mb-3">Pros</p>
    <ul class="space-y-2">
      {#each pros as pro}
        <li class="text-sm text-brand-ink leading-relaxed">{pro}</li>
      {/each}
    </ul>
  </div>
  <div class="rounded-xl border border-brand-sand p-5">
    <p class="text-xs uppercase tracking-widest text-brand-muted mb-3">Cons</p>
    <ul class="space-y-2">
      {#each cons as con}
        <li class="text-sm text-brand-ink leading-relaxed">{con}</li>
      {/each}
    </ul>
  </div>
</div>
```

### Context callout
Used to frame "when to use" and "when not to use" sections.

```svelte
<div class="border-l-2 border-brand-sand pl-5 my-6">
  <p class="text-xs uppercase tracking-widest text-brand-muted mb-1">{label}</p>
  <p class="text-sm text-brand-ink leading-relaxed">{content}</p>
</div>
```

### Official docs reference link
Always rendered at the bottom of a drop when a reference exists.

```svelte
<a href={url} target="_blank" rel="noopener noreferrer"
   class="inline-flex items-center gap-2 text-sm text-brand-muted
          hover:text-brand-ink transition-colors border-b border-brand-sand
          hover:border-brand-ink pb-0.5">
  Storyblok docs: {label}
</a>
```

---

## Layout

- Max content width: `max-w-3xl mx-auto`
- Prose (article body): `max-w-2xl`
- No full-bleed colored sections — warm paper tones only
- No decorative gradients, shadows, or blurs
- Dividers: `border-t border-brand-sand` — never bold rules

---

## Dark mode

Dark mode inverts the ink/paper relationship:

| Light              | Dark                   |
|--------------------|------------------------|
| `bg-brand-paper`   | `bg-brand-deep`        |
| `text-brand-ink`   | `text-brand-paper`     |
| `text-brand-muted` | `text-brand-sand`      |
| `border-brand-sand`| `border-brand-muted`   |

Use Tailwind `dark:` variants. No JS-based theme switching needed — follow system preference via `prefers-color-scheme`.

---

## Do not

- Do not use colors outside the brand palette for UI elements
- Do not use `font-bold` or `font-semibold` — maximum weight is `font-medium`
- Do not use decorative gradients, box shadows, or blur effects
- Do not use emoji in UI — use SVG icons or CSS shapes
- Do not exceed `max-w-3xl` for content layout
- Do not use all-caps or title case in headings or body text
- Do not add rounded corners to single-sided borders (`border-l`, `border-t`)
