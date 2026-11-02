# AGENTS.md

## Hero rules

- The hero contains only the social proof pill, headline, and chat bar. Do not add a navbar, other badges, template cards, extra buttons, sections, or overlays without explicit instruction.
- Headline: "Put your marketing on autopilot", centered, near-black (`--color-ink`), one line on desktop, two balanced lines on mobile (`text-wrap: balance`), word-spacing `0.06em`.
- Layout: social proof pill, headline, and chat bar are centered horizontally and vertically as one group, nudged slightly above true center with `padding-bottom: 6vh`. Stack order is pill, headline, chat bar. Pill-to-headline gap is 20px. Headline-to-chat gap uses `--spacing-hero` (28px). Chat bar is `max-w-[720px]`, full width minus 32px side padding on mobile.
- Background: `/hero-background.webp`, full-bleed, `cover`, `center`. Do not add an overlay unless legibility actually requires it.
- Bottom fade: an absolutely positioned `.hero-bottom-fade` layer sits above the background image and below hero content, with `bottom: -1px`, height `clamp(200px, 32vh, 360px)` (`clamp(140px, 24vh, 240px)` on mobile), `pointer-events: none`, and an eased gradient from transparent white to `var(--section-bg)` (`#ffffff`) using stops 0%, 15%, 35%, 58%, 80%, 92%, 100%. The next section uses `var(--section-bg)` with no top border, margin, or gap.
- Mobile hero rules: `.hero-shell` uses `min-height: 100vh` fallback with `100svh`, plus mobile safe-area padding; mobile headline is `clamp(2rem, 8.4vw, 2.5rem)` with balance. Mobile chat composer uses radius `20px` and min-height `96px`; textarea font-size is at least `16px`. Circular buttons use `32px` visual size with `44px` transparent hit area.

## Section pattern

- Every content section sits inside the shared site container: `max-width: 976px`, `padding-inline: 24px`, `margin-inline: auto`, `box-sizing: border-box`, producing a 928px content column on desktop. The header, stage, window, cards, and feature rows all share that column. Never use `width: 100vw`, negative margins, or full-bleed wrappers for section content.
- Centered section header: eyebrow 20px/400 `#3b82f6`, line-height 1.2, letter-spacing -0.01em, margin 0; H2 `clamp(1.875rem, 3vw, 2.5rem)` (40px desktop), 600, line-height 1.1, letter-spacing -0.025em, color `#0f1115`, normal word spacing, `text-wrap: balance`, margin-top 8px; 40px gap to the next content block. The centered variant has no subtext. The eyebrow must remain larger than every body-copy size in the section except the H2.

## Social proof pill

- Position: centered above the headline; stack order is pill, headline, chat bar.
- Pill: 40px mobile / 44px desktop; fully rounded; padding `4px 14px 4px 4px`; background `#ffffff`; border `1px solid rgba(0,0,0,0.07)`; box-shadow `0 1px 2px rgba(0,0,0,0.04)`, `0 6px 20px rgba(0,0,0,0.06)`. No backdrop filter, translucency, inset highlight, or dark shadows.
- Avatars: 32px mobile / 36px desktop; glassmorphic ring matching the pill (`border-2 border-white/85`, `bg-white/60`, `backdrop-blur-[14px]`, `backdrop-saturate-[140%]`); `object-fit: cover`; `object-position: center 25%` (founder 2 uses `center 72%`); `-8px` mobile / desktop overlap after the first; z-index 1, 2, 3 from left to right. Read from `config/founders.ts`, which supports 3-5 entries. Use `next/image` when files exist in `public/founders/`; otherwise render a neutral gray gradient placeholder with a subtle person silhouette. Never use stock or AI-generated faces. Show at most 3 avatars below `sm`.
- Text: "Built with founders & builders"; 13px mobile / 14px desktop; 500 weight; `letter-spacing: -0.01em`; `line-height: 1.25`; `padding-bottom: 1px`; nowrap; `-webkit-font-smoothing: antialiased`. Gradient `#3f8cff 0% → #8b6cf0 30% → #ec4899 68% → #f97316 100%` with `background-clip: text`; fallback `#6d5cf0`. Gap between avatar group and text is 12px. Mobile: pill uses 28px avatars and 13px text; never wrap text.
- Motion: one 300ms fade-in plus a 4px upward slide on load. Text uses the static rainbow gradient only; no shimmer, glare, or looping animation.
- The pill is non-interactive: no link, button, or hover state. Avatar images keep descriptive alt text; placeholders use `role="img"` and an aria-label ending in "placeholder".
- Accessibility: under `prefers-contrast: more`, use a solid white pill and near-black solid text with no glare animation. Under `forced-colors: active`, use `Canvas` / `CanvasText`, remove the backdrop blur and shadow, and disable the glare animation.

## Typography

- Site font: Inter Tight via `next/font`, exposed as `--font-sans`.
- Body: 450 weight (400-500 range, 500 max for small labels), `line-height: 1.5`, `letter-spacing: -0.015em`.
- Headline: 500 weight, `line-height: 1.08`, `letter-spacing: -0.04em`, `word-spacing: 0.06em`.
- Headline scale: `--text-headline: clamp(1.875rem, 3.2vw, 2.625rem)` (30px to 42px).

## Scale

- Composer textarea: 16px mobile, 17px desktop, `line-height: 1.45`, about 2 lines by default, auto-grow to a max of 6 lines then internal scroll.
- Circular buttons: 32px mobile, 34px desktop. Plus, mic, and send must always share the same size. Icons are 16px with a 1.5px stroke; the send arrow uses a 1.75px stroke.
- Outer glass padding: 6px on every side. Radii: `--radius-glass` 24px, `--radius-composer` 18px.
- Composer card padding: 14px vertical, 16px horizontal; minimum height 108px.
- Button row: 12px above the bottom padding; plus on the left, mic and send on the right with an 8px gap.

## Glass container

- Outer wrapper: `background: rgb(255 255 255 / 0.35)`, `backdrop-filter: blur(16px)`, `1px rgba(255,255,255,0.6)` border, `border-radius: var(--radius-glass)`, 6px even padding. Apply `--shadow-glass: 0 8px 30px rgba(0,0,0,0.06)`.
- Inner composer: near-white `#fcfcfd`, `border-radius: var(--radius-composer)`, `1px rgba(0,0,0,0.05)` border, `0 1px 2px rgba(0,0,0,0.04)` shadow via `--shadow-composer`, 14px/16px padding, minimum height 108px.
- Focus state: no ring, glow, or outline; the composer border stays static while typing.
- Do not replace the glass with an opaque panel or remove the blur without explicit instruction.

## Product showcase

- `#product` uses `var(--section-pad)`, `position: relative; z-index: 0`. The centered header and three-points row stay inside the 976px site container. The scene block (`.product-device-wrap`) is a direct child of `#product`, a sibling of the site container, breaking out to full width: `width: min(1120px, calc(100% - 48px))`, centered, margin-top 40px. `.scene-wrap` is `position: relative`, width 100%, height `calc(780px * var(--s))`. `.desktop` is fixed 1120x780, `transform-origin: top left`, `transform: scale(var(--s))`, `top: 0; left: 0;`, border-radius 22px, overflow hidden, isolation isolate, background 4-layer stack: `var(--wallpaper-url) center 68% / cover no-repeat`, `radial-gradient(60% 70% at 15% 20%, #8ebcff 0%, transparent 60%)`, `radial-gradient(55% 65% at 85% 25%, #c9b6ff 0%, transparent 62%)`, `linear-gradient(160deg, #b9d4f7 0%, #dbe7fb 55%, #eaf0ff 100%)`. box-shadow `0 40px 90px -30px rgba(15,23,42,0.40)`, `0 2px 8px rgba(15,23,42,0.12)`, `0 0 0 1px rgba(15,23,42,0.08)`. Compute `--s = min(1, wrapWidth / 1120)` via useLayoutEffect + ResizeObserver (default 1). No bezel, notch, black border, or camera anywhere.
- Wallpaper reuses the hero background via `--wallpaper-url` token (`/wallpaper.webp`). 4-layer background stack provides fallback color if image fails.
- Assets in `/public/ad-campaigns/`: `meta-feed/burger-bite.webp` (172x215, placeholder #2b1d14), `meta-story/pasta-forks.webp` (179x318, placeholder #0f3a26), `meta-story/burger-cap.webp` (179x318, placeholder #0b1f17), `google-search/forkandflame-favicon.webp` (28x28, placeholder #1f3a2e). Use `next/image` with explicit width/height and placeholder background color. Preload and decode all three photo assets with `Image().decode()` before the timeline starts (timeline starts after `Promise.allSettled` of decode; a failed image keeps its placeholder color but everything else renders).
- Menu bar (z-index 30): height 28px, full width, background `linear-gradient(180deg, rgba(255,255,255,0.38), rgba(255,255,255,0))`, padding 0 16px, Inter Tight 13px weight 500, color #111. Left: inverted bot mark (16px solid #111 circle with two white oval eyes), "Beyond Search" (weight 600), File, Edit, View, Window, Help (18px spacing). No Apple logo. Right: lucide BatteryFull, Wifi, Search, SlidersHorizontal (16px, strokeWidth 1.75), 14px apart, then "Mon Nov 2" and "9:41 AM" (10px apart).
- Dock (z-index 20): position absolute bottom 10px horizontally centered, height 68px, padding 10px, gap 10px, radius 22px, background `rgba(255,255,255,0.32)`, backdrop-filter blur(24px) saturate(180%), border 1px solid `rgba(255,255,255,0.55)`, box-shadow `0 12px 30px -10px rgba(15,23,42,0.4)`, inset `0 1px 0 rgba(255,255,255,0.6)`. Static, pointer-events none. Items left to right: BotMark (Beyond Search, running dot), Claude (`/icons/brands/claude.svg`), ChatGPT (`/dock/chatgpt.svg`), Chrome (`/images/marketing/desktop/dock/chrome.svg`), divider (1px x 44px rgba(0,0,0,0.18)), Trash (`/images/marketing/desktop/dock/trash.png`). Every icon: 34px visual / 48px hit area, border-radius 22.4% (squircle), gloss overlay `linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 45%)`, drop shadow `0 2px 5px rgba(15,23,42,0.22)`, inset hairline `rgba(0,0,0,0.12)`.
- Single-timeline rule: one `useShowcaseTimeline` hook with a single state object (`{ dockBounce, windowOpen, promptWords, sent, panel, steps, creative1, creative2, creative3, google, label, summary, chips, budget, tiles, approveHover, approvePressed, live, banner }`). One ordered list of `[timeMs, patch]` entries scheduled by chained `setTimeout`s, all cleared on cleanup and reset (React StrictMode safe). Every visible element reads ONLY these flags (`className: { flag && "is-in" }`). No per-element animation-delay for reveals. Schedule: 300 dockBounce; 1000 windowOpen; 1600 promptWords; 3500 sent; 4000 panel (skeletons visible, pill = Draft); 4400 steps=1; 5100 steps=2; 5600 creative1; 5800 creative2 + steps=3; 6000 creative3; 6300 google + label; 6500 steps=4; 7200 summary; 7500 chips; 7800 budget; 8200 tiles; 10200 approveHover; 10800 approvePressed; 11000 live + banner; 14000 banner=false; 15200 windowOpen=false; 15800 reset all; loop 16400. Start at 35% visibility (IntersectionObserver), clear timers on leave, restart on re-entry. prefers-reduced-motion: final state at once, no loop.
- App window (z-index 10): position absolute, left 92px right 92px (936px wide), top 80px bottom 80px (clears the dock), border-radius 16px. `.window` uses transform animations only (no opacity). `.window-glass`: position absolute inset 0, border-radius inherit, background `rgba(255,255,255,0.74)`, backdrop-filter blur(28px) saturate(170%), border 1px solid `rgba(255,255,255,0.7)`, box-shadow `0 0 0 0.5px rgba(0,0,0,0.18)`, `0 30px 70px -18px rgba(15,23,42,0.45)`, `0 4px 14px rgba(15,23,42,0.12)`. `.window-content`: position relative z-index 1. Title bar 44px: `flex: none`, `height: 44px`, `box-sizing: border-box`, background `rgba(255,255,255,0.35)`, bottom border 1px `rgba(0,0,0,0.06)`. Left: traffic lights (12px, #ff5f57, #febc2e, #28c840, 8px apart, 16px from left), bot mark (18px light circle with 1px border), "New campaign" (13px weight 600). Right: Draft/Live status pill (11px weight 500). Body: `min-height: 0`, padding-bottom 96px, chat pane 316px wide with right border 1px `rgba(0,0,0,0.06)`, review panel 620px with background `rgba(255,255,255,0.5)`. Usable body height 572px. Typography: base 13px, titles 14px/600, secondary 12px, labels 11px, stat values 20px/600 tabular-nums.
- Review panel (padding 14px 16px 0; vertical budget exactly 572px): container always in DOM, visibility controlled by `panel` flag (opacity/transform). Row 1 (28px) segmented tabs + "6 ads drafted" label (visible with `label` flag). Control row visible as soon as `panel` is true. Row 2 creatives (height 318px, grid 188px auto auto): feed card with burger-bite photo, two story cards (pasta-forks, burger-cap) with overlays. Before each creative flag is true, a skeleton block of the exact same size shows (`rgba(15,17,21,0.06)`, matching radius, soft shimmer every 1.4s). Each crossfades to its real element over 250ms when its flag turns true. Row 3 Google-style search ad (72px). Row 4 analytics tiles (56px, 3 across). Control row (52px pinned bottom): Daily budget $40, Require approval switch ON, Approve & launch button.
- Skeletons: background `rgba(15,17,21,0.06)`, shimmer every 1.4s, crossfade into real elements over 250ms. All skeletons have explicit width/height matching their real elements. No unstyled color blocks.
- Notification banner (z-index 40): at Live, top 40px right 16px, width 270px, padding 10px 12px, radius 14px, background `rgba(255,255,255,0.8)`, backdrop-filter blur(20px) saturate(170%), border 1px solid `rgba(255,255,255,0.7)`, shadow `0 10px 30px -10px rgba(15,23,42,0.35)`. Bot mark 28px: the blue Beyond Search dock icon (inline SVG), not a white circle. title "Beyond Search" (12px/600), body "Your campaign is live on Meta and Google." (12px #3f444c). Enters translateX(24px) to 0, holds 2.4s, fades out 300ms.
- Timeline frame checks: 0.5s wallpaper/menu/dock visible, Beyond Search bouncing, no window; 2.0s window open, centered composer with prompt words; 4.2s chat pane on side with user bubble, review panel with tabs/skeletons/control row, steps 0→1; 6.5s steps 3-4, all three photos visible, Google ad visible, "6 ads drafted" showing, tiles still skeleton; 9.0s summary, targeting chips, budget bar visible, tiles with numbers, nothing under dock; 11.5s status "Live", banner visible, Approve & launch pressed; 15.5s window gone, wallpaper and dock only. No horizontal scroll at 1275px, no console errors, no light-blue block.
- Scene is `aria-hidden="true"`, pointer-events none, with visually hidden description: "Product demo: a user describes their restaurant, agents draft Meta and Google ads using the restaurant's photos, the user approves and launches."
- Mobile (<900px): no menu bar/dock/scale-to-fit/notch. Scene is rounded rectangle (radius 22px) with wallpaper and 12px padding; window relative, no fixed height, single column: chat bubble, agent steps, summary/targeting, review panel. Creatives horizontal scroll-snap row at 280px height (feed 150px wide, stories 158px wide each). Google ad, 3 analytics tiles, stacked control row, full-width 40px Approve & launch button. Banner top-right inside rounded rectangle. Same timeline minus dock bounce.

Mockup font-size table:

| Element | Size / weight |
|---|---|
| Section eyebrow | 20px / 400 |
| Section H2 | `clamp(1.875rem, 3vw, 2.5rem)` / 600 |
| Menu bar | 13px / 500 |
| Window title | 13px / 600 |
| Status pill | 11px / 500 |
| Chat base | 13px / 400 |
| Agent steps/summary | 13px / 400 |
| Follow-up placeholder | 13px / 400 |
| Review tabs | 12px / 500 |
| Review count | 12px / 400 |
| Meta advertiser | 11px / 600 |
| Meta sponsored | 10px / 400 |
| Feed headline | 12px / 600 |
| Shop now chip | 11px / 500 |
| Story headline | 13px / 700 |
| Story CTA | 11px / 600 |
| Google sponsored | 11px / 400 |
| Google headline | 14px / 500 |
| Google description | 12px / 400 |
| Analytics label | 11px / 400 |
| Analytics value | 20px / 600 |
| Daily budget label / value | 12px / 400; 13px / 600 |
| Approval switch label | 12px / 500 |
| Approve & launch | 12px / 500 |
| Caption | 12px / 400 |
| Banner title/body | 12px / 600, 12px / 400 |
| Points label / body | 16px / 600; 14px / 400 |

- Points row is 48px below the caption: three columns, 24px gap, centered 1px `rgba(0,0,0,0.08)` dividers. Each item is a 40px neutral skeuomorphic tile, 14px gap, label 16px/600 `#14161a`, description 14px/1.5 `#5b6070` with `text-wrap: balance`. Use lucide `ShieldCheck`, `Gauge`, and `Megaphone` paths at 20px with 1.75 stroke.

Mobile rules (<900px):
- Hide menu bar and dock. Scene becomes rounded rectangle (radius 22px) with wallpaper and 12px padding; window sits inside it, position relative, no fixed height, single column: chat bubble, agent steps, summary and targeting, then review panel. Creatives become horizontal scroll-snap row at 280px height (feed 150px wide, stories 158px wide each). Google ad, 3 analytics tiles, stacked control row follow, with full-width 40px Approve & launch button. Banner appears top-right inside rounded rectangle. Same timeline minus dock bounce.

## Button system

All buttons use the shared `.btn-skeu` base plus one variant. Use CSS variables and the classes in `app/globals.css`; do not one-off button styles.

- `.btn-skeu`: `appearance: none`, `outline: none`, transparent 1px border, transparent tap highlight, `cursor: pointer`, transition only `background`, `border-color`, and `box-shadow` at 150ms. Focus-visible: 2px `rgba(63,140,255,0.45)` ring with 2px offset. Disabled: default cursor.
- `.btn-circle`: shared responsive size, `--btn-size` 32px mobile / 34px desktop, fully rounded.
- `.btn-neutral` (plus, mic, remove chip): gradient `180deg, #fafafa 0%, #f1f1f1 100%`, `1px rgba(0,0,0,0.07)` border, `0 1px 2px rgba(0,0,0,0.04)` plus `inset 0 1px 0 rgba(255,255,255,0.9)` shadow, icon `#1a1a1a`.
- `.btn-primary` (send, active mic): gradient `180deg, #5aa6ff 0%, #3f8cff 100%`, `1px rgba(255,255,255,0.28)` border, `0 2px 8px rgba(63,140,255,0.28)` plus `inset 0 1px 0 rgba(255,255,255,0.35)` shadow, white icon. Disabled: same gradient at 50% opacity, no shadow, default cursor.
- Hover changes only gradient color values via CSS variables: neutral slightly darker, primary slightly lighter. Active is slightly darker. Never use translate, scale, position, margin, size changes, filter, or blend modes.
- Use only the specified outer plus inset highlight shadows. No extra layers, dark edge shadows, `filter: drop-shadow`, or blend modes. Shadows must remain barely visible.
- Every control needs an `aria-label` (or visible text) and a visible `:focus-visible` style. Use inline SVG icons, not an icon library.

## Tooltips

Use the shared `Tooltip` component and `.tooltip` classes for every button tooltip.

- Show on hover after a 150ms delay; hide immediately on mouse leave. Show immediately on keyboard `:focus-visible`; hide on blur or Escape.
- Do not show on touch devices: gate with `@media (hover: hover) and (pointer: fine)`.
- Placement: centered above the button with a 10px gap from the pointer tip. Clamp horizontally inside the viewport and keep the arrow aimed at the button center.
- Pill: `#2a2a2d`, fully opaque, `border-radius: 8px`, padding `5px 10px`.
- Text: white, Inter Tight (`--font-sans`), 12px, 500, `letter-spacing: -0.01em`, `line-height: 1.2`, `white-space: nowrap`.
- Arrow: 7px square rotated 45deg, `border-radius: 1px`, same background, no shadow. The tooltip box sits 14.95px above the button so the visible arrow tip is 10px above.
- Shadow: only `0 4px 12px rgba(0,0,0,0.18)`. No border, gradient, or glow.
- Motion: 120ms fade plus a 3px upward slide in; 80ms fade out. Remove the slide under `prefers-reduced-motion`.
- `pointer-events: none`, `z-index: 50`, no layout shift. Never place a tooltip inside an `overflow: hidden` ancestor.
- Use `role="tooltip"` and `aria-describedby` on the button; keep the existing `aria-label`.
- Current labels: plus "Attach file", mic "Speech to text" / "Stop listening" while active, send "Send".

## Composer interactions

- Real controlled textarea. Enter submits, Shift+Enter inserts a newline, ignore IME composition. The submit stub logs the value and clears the field; keep the TODO marker until the real flow exists.
- Send stays disabled until the textarea contains non-whitespace text.
- The plus button opens a file picker accepting images and PDFs; attached file names appear as removable chips above the button row.
- The mic button uses the Web Speech API, appends transcripts to the textarea, shows an active state while listening, and is hidden when unsupported.
- The rotating placeholder is a pointer-events-none overlay shown only when empty. Prompts type in at 45ms per character, hold for 1500ms, erase at 20ms per character, and pause for 500ms between prompts. Pause when focused with an empty field, hide when there is content, resume when empty. Respect `prefers-reduced-motion` by showing the first prompt statically.
- Textarea and placeholder use no horizontal inset, so typed/placeholder text starts at the composer content edge aligned with the attach button.

## Performance

- Keep the hero CSS/JS only. Do not add animation or UI libraries.
- The background image must use `next/image` with `priority` and `sizes="100vw"`.
- Isolate typewriter state so timer updates do not re-render the composer.
- Avoid animated blur, shadow, or layout properties beyond the specified 150ms button transitions, social proof entrance, and text-clipped glare sweep.

## Navbar

- Site container (applies to the navbar, dropdown panel, and all future sections): max-width 976px with 24px side padding, centered, so the content area is 928px wide on desktop. Define it as one shared container token and use it for the navbar and the dropdown panel's inner area. The logo sits flush with the container's left edge, and the Book a demo button's right edge sits flush with its right edge.
- Desktop (900px+): fixed full-width bar, height 70px, above hero, no layout shift. Inner container max-width 976px, centered, horizontal padding 24px. Three-column grid `1fr auto 1fr`, all items vertically centered.
- Mobile (under 900px): height 56px. Logo left; right side has "Book a demo" and a 36px menu button.
- Left: logo asset about 30px tall linking to `/` (temporary text wordmark until the logo asset is provided).
- Center: Product and Resources trigger buttons plus Pricing and About links. Nav type: Inter Tight 14px, weight 500, letter-spacing -0.01em, color #14161a, padding 8px. Items use a 16px flex gap. Product and Resources labels sit on a 32px label-to-label rhythm because their trigger buttons apply a -17px right offset to compensate for their 16px chevron plus 1px label gap. Pricing has no chevron and applies a -8px right offset, giving a 24px label-to-label gap to About. About has no margin. ChevronDown is 16px, stroke 2, 1px from the label, and rotates 180deg while open over 180ms. Hover changes color to #000 only.
- Right: one Book a demo button, using the primary blue skeuomorphic variant. Desktop button: height 40px, padding 0 17px, radius 12px, Inter Tight 12px weight 500, no wrapping. Mobile button: height 36px, 13px text, radius 10px. Menu button: 36px, neutral variant.
- Navbar states: transparent with no border and no backdrop blur while at the top (`scrollY < 8`) and no menu is active. At `scrollY >= 8`, show a `.nav-bg-scroll` layer behind the nav content: `rgba(255,255,255,0.94)`, `backdrop-filter: blur(12px)` with the `-webkit-` prefix, and a 1px bottom border `rgba(0,0,0,0.06)`. The passive scroll listener sets the scrolled state and runs once on mount for restored scroll positions. The header stays at `z-50`; sections use `position: relative; z-index: 0`, and stage/window layers must not stack above the header. The row uses `--glass-menu` (`rgba(255,255,255,0.86)` with `backdrop-filter: blur(3px) saturate(130%)` and the `-webkit-` prefix) while a Product/Resources trigger or its panel is hovered, focused, or open, or while the mobile sheet is open. A 1px `rgba(0,0,0,0.06)` hairline sits between the row and the desktop panel, spanning only the 928px nav content width from the logo's left edge to the Book a demo button's right edge. The mobile sheet supplies its own 1px `rgba(0,0,0,0.16)` top border and the row border is transparent while it is open. Background and border-color transition over 200ms. It fades back to transparent when the dropdown closes; it must never remain solid after hovering. If the headline behind the panel is not faintly visible, lower the menu alpha toward `0.80`; never go below `0.80`.
- Scroll behavior: the navbar hides fully offscreen on downward scroll after a small delta, and reappears on upward scroll or when `scrollY <= 8`. It never hides while a dropdown, closing panel, or mobile sheet is open. While hidden it is non-interactive, but reveals on keyboard focus. The hide/reveal transform runs over 200ms ease-out and is removed under `prefers-reduced-motion`.
- Dropdown panel: full-width, attached at top 100% of the navbar inside a fixed clipping viewport, `--glass-menu` with `backdrop-filter: blur(3px) saturate(130%)` and the `-webkit-` prefix. No top border. A 1px rgba(0,0,0,0.06) hairline spans only the 928px nav content width between the navbar row and the panel. Bottom edge: 1px rgba(0,0,0,0.06) border plus box-shadow 0 18px 36px -18px rgba(0,0,0,0.08). No page dimming or overlay. Inner container uses the shared site container, padding-block 16px 16px. Layout: CSS grid, grid-template-columns `1fr 1px 1fr 1px 1fr`, column gap 20px, spanning the full 928px content width. Two `aria-hidden` 1px x 72px dividers use `rgba(0,0,0,0.08)`. The first card's left edge aligns with the logo's left edge, and the last card's right edge aligns with the Book a demo button's right edge.
- Cards: height 72px, radius 16px, padding 0 16px 0 14px, flex row, align-items center, 14px gap. Resting: background rgba(255,255,255,0.55), border 1px solid rgba(0,0,0,0.05), shadow 0 1px 2px rgba(0,0,0,0.03). Hover and focus-visible: background rgba(255,255,255,0.95), border-color rgba(0,0,0,0.09), shadow 0 2px 8px rgba(0,0,0,0.05), no movement or scale. Text block left-aligned, vertically centered, min-width 0: label Inter Tight 14px weight 500 #14161a, line-height 1.25; description below in Inter Tight 12px weight 400 #7a7f8a, line-height 1.3, margin-top 2px. Both single line with text-overflow ellipsis. Hover/focus label and icon #000, description #5b6070. Pressed background rgba(255,255,255,0.80). Transition background-color, border-color, box-shadow, color, and opacity at 180ms. Hover styles are gated to `@media (hover: hover) and (min-width: 900px)`.
- Card arrow: lucide ArrowRight 16px, stroke 1.75, #14161a, margin-left auto. Rest opacity 0 and translateX(-4px); hover/focus opacity 1 and translateX(0). It always reserves its width and is not rendered on mobile.
- Icon tile: 44px square (40px mobile), radius 12px, neutral skeuomorphic gradient #fafafa to #f1f1f1, 1px rgba(0,0,0,0.07) border, box-shadow only 0 1px 1px rgba(0,0,0,0.04) plus inset 0 1px 0 rgba(255,255,255,0.9). Hover and focus-visible gradient #ffffff to #f4f4f4, border rgba(0,0,0,0.09), icon #000. Icon: 20px, lucide, 1.75px stroke, #1a1a1a, centered.
- Product menu cards: Ad Drafting (Sparkles) -> /product/ad-drafting, Autopilot (Rocket) -> /product/autopilot, Integrations (Puzzle) -> /product/integrations. Resources menu cards: Blog (BookOpen) -> /blogs, Help Center (CircleHelp) -> /help, FAQ (CircleHelp) -> /faq.
- Desktop behavior: hover or focus opens a menu after an 80ms delay; closing starts 150ms after the pointer leaves the trigger and panel. Moving between Product and Resources slides the current single-menu grid out over 280ms ease-in, swaps the content, then slides the next grid in from the opposite side over 320ms ease-out, with no height change; the outgoing grid is fully replaced before the incoming grid appears. Clicking a trigger toggles it. Open animation: the panel starts clipped behind the navbar at translateY(-100%) with opacity 0, then drops to translateY(0) with opacity 1 over 220ms ease-out. All menu cards share identical width and height and have no separate per-card entrance animation. Close: the panel retracts to translateY(-100%) and fades over 160ms. Triggers are buttons with aria-expanded and aria-controls; panels use the disclosure pattern. Escape closes and returns focus to the trigger. Clicking outside closes. Route changes close. All links are Tab-reachable with a 2px rgba(63,140,255,0.45) focus-visible ring and 2px offset.
- Mobile behavior: full-screen white sheet below the 56px bar with a 1px rgba(0,0,0,0.16) top border and accordions for Product and Resources (card rows with 40px icon tiles). Cards use the same translucent glass surface, with no divider elements, arrows, or hover styles. Plain Pricing and About links follow, then a full-width 44px Book a demo button with 14px text at the bottom. Body scroll is locked while open. Escape or a route change closes it.
- Stub routes: /product/ad-drafting, /product/autopilot, /product/integrations, /blogs, /faq, /help, /pricing, /about, /book-demo. Each has only a page title in site typography and no content.
- Old AEO/GEO pages (/services, /enterprise, /method, /analyst) are not linked anywhere in the navbar or mobile sheet.
- Accessibility and motion: html has scroll-padding-top 100px. Under prefers-reduced-motion, remove the dropdown drop and menu slide, keeping only color changes. Card arrows fade only, with no slide.