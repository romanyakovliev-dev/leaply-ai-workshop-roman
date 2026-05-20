---
name: frontend-design
description: Pick a visual direction (palette, typography, mood) for the project BEFORE coding the UI. Trigger when the user says "make it look nice", "design it", "what colors", "how should this look", "make it feel [serious/playful/premium/retro]". Critical: do NOT default to the starter's green/radix-nova palette — every project should look distinct.
---

# Frontend design direction

The starter ships with a placeholder palette (green-tinted
`radix-nova`) and stock fonts (Figtree + Geist Mono). **These are
defaults, not a house style.** Every project a Leaply teammate ships
should feel visually distinct — that's where the "wow" lives. If every
forked project looks like the same green Vercel template, the workshop
fails.

So: before you build any UI, pick a direction with the user. Two
minutes of design conversation up front saves an hour of palette-
swapping later.

## When to run this skill

- The user says _"make it look nice"_, _"design it"_, _"make it feel
  premium / playful / serious / retro"_.
- The user picks a color or font and asks if it's good.
- You're about to add the first non-trivial screen and the starter
  palette doesn't fit the product (almost always — see above).
- The user says _"surprise me"_ or _"you choose"_ — don't reach for
  the default, actually choose something distinctive.

## How to run it

### Step 1 — Ask about mood, not colors

> _"Before I touch colors: what's the feel you're going for? Three
> quick options — which is closest?"_
>
> - **A. Calm and trustworthy** (banking, healthcare, productivity)
> - **B. Playful and energetic** (consumer apps, games, kids)
> - **C. Sharp and editorial** (news, portfolios, premium tools)
>
> _Or describe it in your own words — "like X website" / "vibe of
> [movie/brand/era]" works great._

Pick from their answer. Don't commit yet — propose two concrete
visual directions in Step 2.

### Step 2 — Propose two distinct directions

Don't propose one. Don't propose five. **Two.** And they should be
genuinely different, not "blue vs. teal":

Example for "calm and trustworthy":

> **Direction 1 — Soft neutral:** warm off-white background, muted
> slate primary, generous whitespace, serif headings (e.g. Fraunces),
> rounded-2xl cards. Feel: a calm Notion-like productivity tool.
>
> **Direction 2 — Confident dark:** deep navy background, single
> bright accent (yellow or cyan), tight grid, mono accents
> (JetBrains Mono for numbers). Feel: a Bloomberg terminal made
> friendly.
>
> Which one's closer? Or want me to mash them?

Once the user picks, you commit — that's the visual contract for the
rest of the session.

### Step 3 — Translate to actual tokens

Edit **`app/globals.css`** — the palette lives in the `:root` and
`.dark` blocks as `oklch(L C H)` triples. The tokens that matter:

| Token                                | What it controls                     |
| ------------------------------------ | ------------------------------------ |
| `--background` / `--foreground`      | Page bg + main text                  |
| `--primary` / `--primary-foreground` | Buttons, active states               |
| `--accent` / `--accent-foreground`   | Highlights, hover states             |
| `--muted` / `--muted-foreground`     | Secondary surfaces, hint text        |
| `--border`                           | All borders, dividers                |
| `--chart-1..5`                       | Data viz colors (see charts skill)   |
| `--radius`                           | Corner roundness (cards, buttons, …) |

Swap **all** of these — don't leave the defaults sitting alongside
your new colors. The `oklch` format makes it easy to keep hue and
adjust lightness/chroma for dark mode. Quick reference:

- Hue: `0°` red → `60°` yellow → `120°` green → `180°` cyan → `240°`
  blue → `300°` magenta.
- Chroma: `0` = grayscale, `~0.15` = vivid but tasteful, `~0.25` =
  loud. Keep dark-mode chroma a hair lower than light.
- Lightness: `0.05` near-black, `0.5` mid, `0.95` near-white.

Use <https://oklch.com/> in a browser if you want to pick by eye.

For a starting palette, the **shadcn theme picker** at
<https://ui.shadcn.com/themes> is a quick way to grab a coherent
oklch block — but don't ship the exact same theme twice; tweak it.

### Step 4 — Typography

The starter has Figtree (sans) and Geist Mono. Change at least one,
unless the chosen direction genuinely calls for them.

In `app/layout.tsx`, you can swap Google Fonts:

```ts
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google"
```

A few combos that work:

- **Editorial:** Fraunces (display) + Inter (body).
- **Playful:** Sora or Outfit (everything).
- **Technical:** Geist Sans + Geist Mono (default — actually fine
  if "developer tool" is the mood).
- **Retro:** Space Grotesk + Space Mono.
- **Premium serif:** Instrument Serif (display) + Inter (body).

### Step 5 — One signature element

The thing that makes a project feel _designed_ is usually one
intentional flourish. Pick one for this project:

- a colored gradient that appears on hero / empty states
- a hand-drawn / brush divider asset in `public/`
- a single illustrated icon set ([lucide](https://lucide.dev),
  [remixicon](https://remixicon.com) — already shipped, but pick a
  consistent weight), or one custom SVG mark
- non-square radius (e.g. `--radius: 1.25rem` for soft, or `0px` for
  brutalist)
- a subtle texture / grain on the background
- bold uppercase tracking on labels

Just **one**. Two is busy, three is noise.

## What you must NOT do

- ❌ Default to the green starter palette without asking. It's a
  placeholder, not a brand.
- ❌ Propose "blue + slight variations" five times. If your two
  options aren't genuinely different, you're not designing — you're
  picking a tint.
- ❌ Push a "Leaply house style" across projects. Diversity is the
  feature here.
- ❌ Hardcode hex values in components (`bg-[#3b82f6]`). Always go
  through the token (`bg-primary`, `text-accent-foreground`). The
  tokens live in `globals.css`; components only reference them.
- ❌ Hand-roll a "custom Button" to match a new style. The shadcn
  primitives already pick up your token changes — see the
  `shadcn-component` skill.
- ❌ Spend more than ~5 minutes on direction before the user has
  seen a real screen. Pick something, build the first screen, then
  iterate.

## After picking a direction

Move on to building. The first real screen will tell you whether the
palette actually works — be ready to nudge the chroma or swap one
token after you see it rendered. That's normal, not a redo.
