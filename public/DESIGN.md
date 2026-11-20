# Abhinav Caterers: design rules

Every UI change (new sections, pages, copy) follows this file. Change a token in `public/polish.css`, never hard-code a value.

## Feel
Pure-veg celebration catering. Deep green room, warm gold light, cream paper. Warm, abundant, calm. One memorable thing per section; everything around it stays quiet.

## Palette (named tokens in `:root`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#071411` | page ground |
| `--bg2` | `#0c1d18` | raised ground |
| `--card` | `#10251e` | panels, modals |
| `--ink` | `#f5efe3` | main text |
| `--muted` | `#a9b2aa` | secondary text |
| `--line` | `rgba(245,239,227,.14)` | 1px borders and dividers |
| `--gold` | `#cda86a` | accents, active state, section labels, headings' emphasised words |
| `--teal` | `#3c8d86` | glow behind the hero only |
| `--cream` | `#f1e6d0` | primary buttons, ticket paper, selected chips |
| `--fuse` | `#b9740f` | the burning line and letters on cream buttons |
Rules: gold marks what is active or special; do not use it for decoration. Cream is the only light surface (buttons, tickets, selected chips). No new hues.

## Type
- Display: **Cormorant Garamond** 600, tight tracking (-.04em), line-height .9 to 1. Section headings `clamp(50px, 6vw, 86px)`. One gold italic phrase per heading is the site's signature; keep it to one.
- Body: **DM Sans** 400/500/600/700. 15 to 16px body, line-height 1.6 to 1.8, measure under 70 characters.
- Telugu: **Noto Sans Telugu**, always `lang="te"`, 12.5 to 15px, in `--muted` (or paper-dim on tickets).

## Shape
- Pills (`--r-pill`, 999px): buttons, chips, tabs.
- Cards (`--r-card`, 20px) and inputs (`--r-control`, 10px).
- Tickets are the one square-cornered thing (3px).

## Spacing
- Section rhythm is two variables: `--sec-open` (above content) and `--sec-close` (below). Every `.section` uses them. Never add ad-hoc section padding; that is what created dead gaps.
- Page margin is `--edge` (5vw, 20px on phones).
- No seam may leave a large empty field.

## Buttons
- Primary: cream pill, dark-green text, 700 weight. Secondary (`.outline`): transparent, 1px `--line`.
- **Fuse hover** on every `.plan-btn`: a 3px `--fuse` line burns left to right over 620ms (linear) with a spark at its head, and the letters turn `--fuse` one after another over the same time. Keyboard focus does the same. Press scales to .97.
- Touch targets are at least 44px.

## Signature patterns
- **Ticket rail** (`#signature`): cream paper tickets on a steel rail. Active ticket drops 40px and swings once (1s). Touch swipes with snap; mouse drags with a damped spring (stiffness 60); arrows and Home/End work everywhere. "Open in menu" switches the menu tab and category and highlights the dish.
- **Diya time slots** - **Planner choices**: meals are tiles; spice level is four cards with one to four chillies (gold when chosen, no new hues); pickup/delivery are two cards. Spice and pickup use native radios and meals keep their original `<select>`, so the quote and WhatsApp path never depends on custom widgets. Event time is a plain dropdown.
- **Nav wordmark** fades out (500ms) while the hero title passes under it, and returns after.

## Motion
- Easing `--ease: cubic-bezier(.2,.7,.2,1)` for almost everything.
- Colour changes 200ms, moves 450 to 700ms, fuse 620ms, ticket drop 560ms.
- Motion answers an action. No decorative looping, except the marquee and the lit flame.

## Accessibility (non-negotiable)
- Real buttons and links. Visible focus: 2px gold outline, 3px offset, on everything focusable.
- Skip link first in the page. Decorative things (marquee, canvases, SVG flames) are `aria-hidden`.
- Groups of choices are `radiogroup` with arrow-key support; live regions (`aria-live="polite"`) for counts and selections.
- Alt text on meaningful images; Telugu text has `lang="te"`.
- `prefers-reduced-motion`: final states at once, no loops, no autoplay (videos wait for play), reveals shown, rails jump instead of glide.
- Works at 390px (phone), 820px (tablet), 1440px (laptop) with no horizontal scroll.

## Avoid
New colours, gradients on text, glowing badges, identical card grids, autoplay with sound, anything that blocks the quote flow, and removing the `/api/quote` + WhatsApp path.