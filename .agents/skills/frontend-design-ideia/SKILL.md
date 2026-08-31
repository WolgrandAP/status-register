---
name: frontend-design-ideia
description: The IDE.IA visual identity, loaded as a design skill — for building/styling any web frontend (apps, sites, dashboards, landing pages, components) in the IDE.IA look. Ships the real brand fonts (Urbanist + Olney), light & dark design tokens, logos (SVG + PNG), light & dark icon sets, patterns, illustrations, foundation specimen cards, web-component recipes, and a design method (subject-grounding, plan→critique→build, restraint, and writing craft). Use whenever building for IDE.IA or asked for the "IDE.IA look/brand/theme/identity" in HTML/CSS/React/Tailwind.
user-invocable: true
---

# IDE.IA — Visual Identity & Frontend Design

This skill **is** the IDE.IA visual identity, packaged for the web. IDE.IA is an AI research
laboratory ("*laboratório*"). The real fonts, logos, light & dark icon sets, patterns,
illustrations, the design-token system, and web-component recipes all live inside this skill —
everything needed to design and build IDE.IA web UI.

Social handle: `@ide.ia_`. Language: **Portuguese (Brazil)** by default.

## How to use this skill

1. **Read `references/brand-foundations.md`** — the authoritative, non-negotiable brand rules
   (palette, type, shape, iconography, voice). Everything you make obeys these.
2. **Read `references/design-method.md`** — *how to design well within the identity*: grounding in
   the subject, the plan→critique→build→critique process, restraint/self-critique, the quality
   floor, and writing craft. This is what separates a real IDE.IA surface from a generic one.
3. **Read `references/web-components.md`** for building web UI (buttons, inputs, cards, nav,
   tables, badges, heroes) in both light and dark modes.
4. **Wire the styling.** Import `styles.css` (base tokens) + `references/tokens-web.css`
   (interactive/state tokens). For the **real brand fonts**, also import `fonts/brand-fonts.css`
   then `fonts/brand-fonts-override.css`. Reference CSS variables — never hardcode a hex a token
   already defines.
5. **Pull assets** from `assets/` into the target project: `assets/logo/` (SVG in `svg/`, plus
   curated PNGs), `assets/icons/` (light) & `assets/icons-dark/` (dark), `assets/patterns/`,
   `assets/illustrations/`. Prefer SVG so marks/icons recolor and scale cleanly.

When invoked with no other guidance, ask what surface is being built and which mode (light /
dark), then act as IDE.IA's design lead — output a static HTML artifact for mocks, or production
code (React / Tailwind / plain CSS) for real work.

## Quick start (correct import order)

The import order is the easiest thing to get wrong — each layer depends on the one above it. Wire
it exactly like this:

```html
<!-- 1. base tokens (also pulls in the Google-Fonts substitutes) -->
<link rel="stylesheet" href="styles.css">
<!-- 2. web-only interactive/state tokens -->
<link rel="stylesheet" href="references/tokens-web.css">
<!-- 3+4. REAL brand fonts — omit BOTH lines to keep the Mulish/Montserrat/Sora substitutes -->
<link rel="stylesheet" href="fonts/brand-fonts.css">
<link rel="stylesheet" href="fonts/brand-fonts-override.css">
```

Minimal light-mode hero using only tokens (never hardcode a hex a token defines):

```html
<section style="background:var(--surface-page); padding:var(--space-7) var(--space-6);">
  <p class="eyebrow">LABORATÓRIO</p>
  <h1 class="title" style="font-size:var(--text-display-size);">Título em sentence case</h1>
  <div style="width:100px; height:6px; background:var(--green-400); margin-top:var(--space-3);"></div>
</section>
```

For a dark/technical surface, swap `--surface-page`→`--surface-dark`, text→`--text-body-inverse`,
eyebrow→`--text-brand-on-dark`, and group content in a `.card-dark` (rounded). See
`references/web-components.md` for the `.eyebrow`/`.title` class definitions.

**Note:** `styles.css` always imports the Google-Fonts substitutes via `tokens/fonts.css`. For a
pure-real-font production build you can drop that `@import` to avoid loading fonts you won't use.

## What's inside

| Path | What it is |
|---|---|
| `references/brand-foundations.md` | **Start here** — authoritative brand rules. |
| `references/design-method.md` | **Read second** — the craft & process: subject-grounding, plan→critique→build, restraint, quality floor, writing. |
| `references/web-components.md` | Web UI component recipes, light + dark. |
| `references/tokens-web.css` | Web-only interactive/state tokens (documented extensions). |
| `styles.css` + `tokens/*.css` | Design-token system (colors, type, spacing, webfont load). |
| `fonts/` | **Real brand fonts** — Urbanist family (all weights) + Olney — with `@font-face` + override CSS. |
| `assets/logo/` | Logos: `svg/01–10.svg` + curated PNGs. See `assets/logo/README.md` for the per-file index and a color caveat. |
| `assets/icons/` + `assets/icons-dark/` | Light & dark icon sets (SVG + PNG). |
| `assets/patterns/` + `assets/illustrations/` | Network/node pattern motif and illustration assets. |
| `guidelines/*.html` | Foundation specimen cards (colors, type, spacing, brand). |
| `NOTICE.md` | Font licensing & attribution — **read before distributing** (Urbanist = OFL; Olney = unresolved). |

The `assets/logo/svg/01–10.svg` marks cover green/white tile badges, transparent green marks, dark
tiles, and a `currentColor` mono mark (`09.svg`) for exact token recoloring — see
`assets/logo/README.md` for the per-file index. Prefer SVG so marks recolor and scale cleanly.

## The two modes

- **Light / standard** — white bg, near-black text, **square corners**, mint (`--green-400`) big
  fills, leaf-green (`--green-600`) for icon strokes and the logo, `--text-brand` /
  `--interactive-primary` (green-700) for links and buttons, thin line icons (`assets/icons/`).
  Institutional / marketing / content. Default.
- **Dark / technical** — navy bg (`--navy-900`), white text, **rounded cards**
  (`--radius-card-dark`), thicker mint icon set (`assets/icons-dark/`), Sora/Urbanist carries body
  text. Dashboards, technical/developer tools.

One mode per surface; don't blend the two icon sets or corner regimes on one screen.

## Designing well within the identity (in brief)

IDE.IA has **already made the bold aesthetic commitment** — two greens, square light / rounded
dark, the network motif, Urbanist + Olney, no shadows, no emoji. So your job isn't to invent a
look; it's to **execute this one with conviction** and never let it decay into generic green SaaS
(rounded-everything, a soft shadow, a green→teal gradient, emoji icons, a rainbow chart). Full
craft in `references/design-method.md`; the essentials:

- **Ground it in the subject first.** Name the surface, its reader, and its one job; then pick the
  mode the subject demands. State your choices if the brief doesn't.
- **The hero is a thesis** — open with the most characteristic thing, reaching for a brand signature
  (pattern bleed, mint accent bar, dark comparison table) before the safe metric-card answer.
- **Structure must encode meaning** — an eyebrow, a divider, the faint oversized number belong only
  where there's a real section/sequence to mark, never as decoration.
- **Plan → self-critique → build → critique again.** Draft a compact plan from the *fixed* tokens
  (color roles, type roles, layout, one signature), then ask "would I produce this for any brief?"
  and revise anything generic *before* coding. Screenshot and re-check against the hard rules.
- **Spend emphasis in one place, then remove one thing.** Let a single signature carry the screen;
  keep the rest quiet. Hit the quality floor silently: responsive, visible `:focus-visible`,
  `prefers-reduced-motion`, correct contrast.
- **Copy is design material** — write from the reader's side, active voice, stable action names,
  errors and empty states as direction (see the writing section in `design-method.md`).

## Hard brand rules (never break)

- **Only two greens + black/white/navy.** No other hue, no gradients. Grays are derived neutrals
  for text/hairlines only. The green-700/800/900 steps are darker shades of the same green for
  text and interactive states, not a third hue — see the contrast rule in `brand-foundations.md`:
  `--green-600` is the brand mark's hue and never carries body text on white.
- **Light mode = square corners, no drop shadows.** Rounded corners only in dark-mode cards and
  on icon badges / logo dots. No pill buttons. Separation via whitespace + green/white contrast.
- **Type:** Urbanist is the real brand face (Olney for display accents); the deck tokens
  substitute Mulish/Montserrat/Sora when the real fonts aren't wired. Headings bold, **sentence
  case**. Eyebrows/labels UPPERCASE, letterspaced.
- **Iconography:** never mix the light and dark icon sets on one surface. Prefer SVG.
- **No emoji anywhere** — use the brand icon SVGs.
- **PT-BR by default.** Plain, instructional, third-person institutional tone — no hype.
- **Motion:** minimal, ~150–200ms, no bounce/spring.

## Fonts — real vs. substitute (important)

The **real** identity fonts are **Urbanist** (primary) + **Olney** (display accent), shipped in
`fonts/`. The design-token system was originally built from the PPTX deck, which embedded no
usable font files, so `tokens/typography.css` substitutes **Mulish / Montserrat / Sora** from
Google Fonts. Both paths work:
- **Real fonts (preferred for production):** import `fonts/brand-fonts.css` +
  `fonts/brand-fonts-override.css` after `styles.css`.
- **Web substitutes (zero-asset, e.g. quick artifacts):** just use `styles.css` as-is.
