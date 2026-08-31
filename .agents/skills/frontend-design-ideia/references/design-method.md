# IDE.IA — Design method (how to design *well* within the identity)

`brand-foundations.md` says **what** IDE.IA looks like. This file says **how to design with it** —
the craft and process that separate a real IDE.IA surface from a generic one that merely uses the
tokens. Read it after the foundations, before you build anything non-trivial.

The framing is different from a "pick-your-own-look" design brief. IDE.IA has **already made the
bold aesthetic commitment** for you: two greens, square light / rounded dark, the network motif,
Urbanist + Olney, no shadows, no emoji. Your job is not to invent a direction — it is to **execute
that direction with conviction** and refuse to let it decay into template green SaaS. The risk was
spent on the identity; you spend your effort on precision.

---

## 1. Ground it in the subject

Before choosing a single component, pin down three things and state them:

- **What** is this surface (a dashboard, an auth screen, a marketing hero, a settings panel, a
  comparison table)?
- **Who** reads it — an IDE.IA researcher, a prospective partner, a developer using a technical
  tool, an institutional visitor?
- **Its one job** — the single thing this screen must accomplish. Everything else is support.

If the brief leaves these open, choose them yourself and say so. Then pick the **mode** the subject
demands: *light/standard* for institutional, marketing, and content surfaces; *dark/technical* for
dashboards, developer tools, and dense comparison/score screens. One mode per surface (see the
foundations — never blend corner regimes or icon sets).

If your memory holds prior IDE.IA work, the user's preferences, or earlier decisions, use them as
a hint so the new surface feels part of the same body of work, not a one-off.

---

## 2. Design principles (within the brand)

**The hero is a thesis.** Open with the most characteristic thing about the subject, not a generic
banner. IDE.IA's own hero vocabulary: a sentence-case display headline in Urbanist/Mulish, an
eyebrow above it, the mint accent bar under it, and the `network-outline` pattern bled off a corner
at low opacity. The template answer — a big number + small label + accent — is only right when the
subject genuinely *is* a metric. Reach for the brand's signature moves before the safe ones.

**Typography carries the personality.** Urbanist (display, bold, sentence case) against Montserrat/
body, with Olney reserved for rare display accents, *is* the deliberate pairing — don't flatten it
to one weight at one size. Set a real scale: display (`--text-display-size`) for hero, title
(`--text-title-size`) for sections, `--text-ui-size` for dense UI. Eyebrows earn their uppercase
letter-spacing (`--text-eyebrow-tracking`). Type is a memorable part of the design, not a neutral
delivery vehicle.

**Structure is information.** IDE.IA leans on eyebrows, the mint accent bar, hairline dividers, and
the faint oversized card number (`rgba(128,233,120,0.28)`). Use each only when it encodes something
true: the oversized number belongs on a *real* sequence (step 01 / 02 / 03 of a process), an eyebrow
labels a genuine section ("LABORATÓRIO"), a hairline separates things that are actually distinct.
Never number items that aren't a sequence, never add a divider that divides nothing.

**Motion is deliberate and quiet.** The brand rule is ~150–200ms, no bounce/spring
(`--motion-fast`, `--motion-normal`, `--motion-ease`). Ask where motion *serves*: a page-load
settle, a scroll reveal on a section, a hover state on a control. One orchestrated moment beats
scattered effects — and here, less is almost always more. Extra animation is one of the fastest ways
a surface starts to read as AI-generated. Always respect `prefers-reduced-motion`.

**Match effort to the surface.** IDE.IA is a disciplined, minimal identity, so the craft lives in
*precision*: exact spacing off the scale, true square corners (not 2px "almost square"), clean
hairlines, correct contrast pairings, type set on a real scale. A minimal direction executed
loosely reads as unfinished; executed precisely it reads as authoritative.

---

## 3. Process: plan → self-critique → build → critique again

Do this in your thinking; only surface ideas to the user once you're confident they'll land.

**First pass — a compact plan, derived from the fixed tokens (do not invent new ones):**
- **Mode & surface:** light or dark, and what the screen is (§1).
- **Color roles:** which of the two greens does what here — `--green-600` for links/accents/icon
  strokes/light-mode buttons, `--green-400` as a fill (bands, badges, chart segments), navy + white
  for dark. No third hue, no gradient.
- **Type roles:** which face and size at each level (display / title / eyebrow / body / UI /
  dark-mode `--font-accent`).
- **Layout concept:** a one-sentence description plus a quick ASCII wireframe to compare options.
- **Signature:** the one thing this screen is remembered by — almost always drawn from IDE.IA's own
  kit: the network-pattern corner bleed, the mint accent bar, the dark rounded comparison table, an
  icon-badge grid, the running logo lockup in a fixed corner. Pick **one** to carry the screen.

**Then critique the plan against the brief before writing code.** Ask: *would I produce this exact
layout for almost any brief?* IDE.IA has its own trap — generic "green SaaS": rounded cards
everywhere, a soft drop shadow, a green→teal gradient, emoji icons, a rainbow chart. If any part of
the plan drifted there, or drifted off-brand, revise it and say what you changed and why. Only build
once the plan is genuinely an IDE.IA surface, then follow it exactly, deriving every color and type
choice from tokens.

**When writing the code**, watch CSS selector specificity — type-based selectors (`.section`) and
element/utility selectors (`.card`, `.cta`) easily cancel each other's padding/margins, especially
between sections. Keep spacing on the `--space-*` scale and avoid competing overrides.

**Critique again as you build.** Take a screenshot if the environment allows — a picture is worth a
thousand tokens. Check it against the hard rules: any stray radius in light mode? any shadow? more
than two greens? emoji sneaking in? mixed icon sets? If you have somewhere to jot notes on what
you've tried, keep them — it compounds across passes.

---

## 4. Restraint and self-critique

**Spend the emphasis in one place.** Let the chosen signature be the one loud thing and keep
everything around it disciplined — this is exactly how IDE.IA already works (a single mint band, a
single pattern bleed, whitespace doing the rest). Cut any decoration that doesn't serve the job.

**Build to a quality floor, quietly:**
- Responsive down to mobile (use the `--bp-*` breakpoints; `--container-max` for the main column).
- Visible keyboard focus everywhere (`:focus-visible` ring is defined in `tokens-web.css` — don't
  remove it; light uses `--focus-ring-color`, dark uses `--focus-ring-color-dark`).
- `prefers-reduced-motion` respected.
- Contrast honored: mint (`--green-400`) is a fill, never body text on white; body is `--gray-900`
  on white / `--text-body-inverse` on navy; interactive-icon-only controls get an `aria-label`.

Then apply the Chanel test: before you ship, look again and **remove one thing** — the accessory the
surface doesn't need. In a minimal identity, the last thing removed is usually what makes it read as
IDE.IA rather than as a generic app that happens to be green.

---

## 5. Writing in the IDE.IA voice

Copy is design material, not decoration — bring the same intent to it as to spacing and color. The
brand-voice rules (PT-BR by default, sentence-case titles, UPPERCASE eyebrows, warm "Obrigada!/
Obrigado!", no hype, no emoji) live in `brand-foundations.md`. This is the craft on top of them:

- **Write from the reader's side of the screen.** Name things by what the person controls and
  recognizes, never by how the system is built — *"Notificações"*, not *"Configuração de webhook"*.
  Describe what something does in plain terms; specific always beats clever.
- **Active voice, and a control says what it does.** Prefer *"Salvar alterações"* over *"Enviar"*.
  Keep an action's name stable through the whole flow: the button *"Publicar"* produces a toast
  *"Publicado"*. That consistency is how people learn their way around the product.
- **Treat errors and empty states as direction, not mood.** Say what went wrong and how to fix it,
  in the interface's institutional voice — errors don't apologize and are never vague. An empty
  screen is an invitation to act, and a natural home for the quiet network-pattern bleed.
- **One job per element.** A label labels, an example demonstrates; nothing does double duty. Plain
  verbs, sentence case, no filler, tone matched to an institutional research lab — never salesy.
- Lorem Ipsum is acceptable as filler, but always flag it as placeholder.
