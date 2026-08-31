# IDE.IA logo assets — index

All SVG marks share `viewBox="0 0 1080 1080"` and render the **network/node** symbol (the brand
mark, not the "IDE.IA" wordmark). Categorized below by verifiable attributes — open the file to
confirm the exact positive/negative arrangement you need.

## Curated PNGs (full lockup: mark + wordmark)
| File | Use on |
|---|---|
| `ideia-logo-full.png` | light backgrounds |
| `ideia-logo-full-white.png` | dark backgrounds |
| `ideia-logo-mark.png` | the mark alone, any context |

## SVG marks (`svg/`, preferred — scalable & recolorable)
| File | Composition | Best for |
|---|---|---|
| `01`–`04.svg` | mark on a **filled 1080² square tile**, green + white | app-icon / avatar / favicon-style badge — pick the positive (green-on-white) or negative (white-on-green) variant you need |
| `05.svg`, `06.svg` | **green mark, transparent** background (no tile); 06 slightly larger | inline mark on a light surface |
| `07`, `08.svg` | mark on a **dark tile** (`#22212c`) + green + white | badge in dark/technical contexts |
| `09.svg` | **mono mark, `fill="currentColor"` on the root `<svg>`** | **theming — recolor to any token** by setting `color:` on the `<svg>`/parent |
| `10.svg` | green mark, transparent, single path | inline mark on light, minimal file |

**Recoloring:** `09.svg` is the one to reach for when the mark must match an exact brand token —
`<svg style="color: var(--green-600)">…</svg>` (or `--white` on dark). The others carry baked-in
fills.

Note that this only works because the root `<svg>` carries `fill="currentColor"` explicitly. An
SVG with no `fill` at all does **not** inherit `color` — the initial value of the SVG `fill`
property is `black`, so it would render as a black mark no matter what `color` you set. If you add
more mono marks to this folder, declare the fill.

## ⚠️ Off-token colors in the shipped SVGs
The SVG marks use **`#58bf62`** (green) and **`#22212c`** (near-black) — which are **not** in the
design-token palette (`--green-600` = `#3FA14C`, `--navy-900` = `#111A24`, `--black` = `#000`).
Two ways to handle it:
- **Accept it** — a logo may legitimately keep its own locked brand green; just don't sample these
  hexes into UI tokens (keep using `--green-600` / `--navy-900` for everything else).
- **Match exactly** — use `09.svg` (`currentColor`) and drive its color from a token, so the mark
  aligns with the rest of the surface.

Either is fine; just don't let `#58bf62`/`#22212c` leak into component styles as if they were
brand tokens.
