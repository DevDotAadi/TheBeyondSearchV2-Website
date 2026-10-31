# AGENTS.md

## Hero rules

- The hero contains only the social proof pill, headline, and chat bar. Do not add a navbar, other badges, template cards, extra buttons, sections, or overlays without explicit instruction.
- Headline: "Put your marketing on autopilot", centered, near-black (`--color-ink`), one line on desktop, two balanced lines on mobile (`text-wrap: balance`), word-spacing `0.06em`.
- Layout: social proof pill, headline, and chat bar are centered horizontally and vertically as one group, nudged slightly above true center with `padding-bottom: 6vh`. Stack order is pill, headline, chat bar. Pill-to-headline gap is 20px. Headline-to-chat gap uses `--spacing-hero` (28px). Chat bar is `max-w-[720px]`, full width minus 32px side padding on mobile.
- Background: `/hero-background.webp`, full-bleed, `cover`, `center`. Do not add an overlay unless legibility actually requires it.
- Bottom fade: an absolutely positioned `.hero-bottom-fade` layer sits above the background image and below hero content, with `bottom: -1px`, height `clamp(200px, 32vh, 360px)` (`clamp(140px, 24vh, 240px)` on mobile), `pointer-events: none`, and an eased gradient from transparent white to `var(--section-bg)` (`#ffffff`) using stops 0%, 15%, 35%, 58%, 80%, 92%, 100%. The next section uses `var(--section-bg)` with no top border, margin, or gap.

## Social proof pill

- Position: centered above the headline; stack order is pill, headline, chat bar.
- Pill: 40px mobile / 44px desktop; fully rounded; padding `4px 14px 4px 4px`; background `#ffffff`; border `1px solid rgba(0,0,0,0.07)`; box-shadow `0 1px 2px rgba(0,0,0,0.04)`, `0 6px 20px rgba(0,0,0,0.06)`. No backdrop filter, translucency, inset highlight, or dark shadows.
- Avatars: 32px mobile / 36px desktop; glassmorphic ring matching the pill (`border-2 border-white/85`, `bg-white/60`, `backdrop-blur-[14px]`, `backdrop-saturate-[140%]`); `object-fit: cover`; `object-position: center 25%` (founder 2 uses `center 72%`); `-8px` mobile / desktop overlap after the first; z-index 1, 2, 3 from left to right. Read from `config/founders.ts`, which supports 3-5 entries. Use `next/image` when files exist in `public/founders/`; otherwise render a neutral gray gradient placeholder with a subtle person silhouette. Never use stock or AI-generated faces. Show at most 3 avatars below `sm`.
- Text: "Trusted by founders & builders"; 13.5px mobile / 14px desktop; 500 weight; `letter-spacing: -0.01em`; `line-height: 1.25`; `padding-bottom: 1px`; nowrap; `-webkit-font-smoothing: antialiased`. Gradient `#3f8cff 0% → #8b6cf0 30% → #ec4899 68% → #f97316 100%` with `background-clip: text`; fallback `#6d5cf0`. Gap between avatar group and text is 12px.
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

- Site container (applies to the navbar, dropdown panel, and all future sections): max-width 1000px with 24px side padding, centered, so the content area is about 952px wide on desktop. Define it as one shared container token and use it for the navbar and the dropdown panel's inner area. The logo sits flush with the container's left edge, and the Get started button's right edge sits flush with its right edge.
- Desktop (900px+): fixed full-width bar, height 70px, above hero, no layout shift. Inner container max-width 1000px, centered, horizontal padding 24px. Three-column grid `1fr auto 1fr`, all items vertically centered.
- Mobile (under 900px): height 56px. Logo left; right side has "Get started" and a 36px menu button.
- Left: logo asset about 30px tall linking to `/` (temporary text wordmark until the logo asset is provided).
- Center: Product and Resources trigger buttons plus Pricing and About links. Nav type: Inter Tight 14px, weight 500, letter-spacing -0.01em, color #14161a, padding 8px 7px, no extra gap between items. Visible space from a chevron to the next label measures about 16px. ChevronDown is 16px, stroke 2, 3px from the label, and rotates 180deg while open over 180ms. Hover changes color to #000 only.
- Right: one Book a demo button, using the primary blue skeuomorphic variant. Desktop button: height 40px, padding 0 17px, radius 12px, Inter Tight 12px weight 500, no wrapping. Mobile button: height 36px, 13px text, radius 10px. Menu button: 36px, neutral variant.
- Navbar states: transparent with no border when scrollY is under 8px and no menu is open; otherwise background rgba(255,255,255,0.94), backdrop-filter blur(12px), and a 1px bottom border rgba(0,0,0,0.06). Background and border-color transition over 200ms.
- Dropdown panel: floating card attached 8px below the 70px navbar, horizontally centered, max-width calc(100vw - 32px), width max-content, solid #ffffff, 1px rgba(0,0,0,0.06) border, 22px radius, 8px padding, shadow 0 16px 40px rgba(0,0,0,0.08) plus 0 2px 8px rgba(0,0,0,0.04), no overlay or page dimming. Inner row is a flex row with 8px gap. Cards region follows content: about 584px for Product and about 392px for Resources. Cards are flex: none, min-width 184px, 64px tall, 14px radius, transparent background and border at rest, 0 16px 0 12px padding, flex row, centered, 12px gap. Hover/focus: #f6f6f8 background and rgba(0,0,0,0.05) border. Icon tile: 40px square, 11px radius, neutral skeuomorphic gradient #fafafa to #f1f1f1, 1px rgba(0,0,0,0.07) border, shadow 0 1px 1px rgba(0,0,0,0.04) plus inset 0 1px 0 rgba(255,255,255,0.9). Icon: 20px, lucide, 1.75px stroke, #1a1a1a. Label: Inter Tight 14px weight 500, #14161a, label only.
- Product menu cards: Ad Drafting (Sparkles) -> /product/ad-drafting, Autopilot (Rocket) -> /product/autopilot, Integrations (Puzzle) -> /product/integrations. Resources menu cards: Blog (BookOpen) -> /blogs, FAQ (CircleHelp) -> /faq.
- Desktop behavior: hover or focus opens a menu after an 80ms delay; closing starts 150ms after the pointer leaves the trigger and panel. Moving between Product and Resources swaps instantly. Clicking a trigger toggles it. Open animation: opacity 0 to 1 plus translateY(-4px to 0) over 160ms. Close: 100ms fade. Triggers are buttons with aria-expanded and aria-controls; panels use the disclosure pattern. Escape closes and returns focus to the trigger. Clicking outside closes. Route changes close. All links are Tab-reachable with a 2px rgba(63,140,255,0.45) focus-visible ring and 2px offset.
- Mobile behavior: full-screen white sheet below the 56px bar with accordions for Product and Resources (card rows with 40px icon tiles), plain Pricing and About links, then a full-width 44px Book a demo button with 14px text at the bottom. Body scroll is locked while open. Escape or a route change closes it.
- Stub routes: /product/ad-drafting, /product/autopilot, /product/integrations, /blogs, /faq, /pricing, /about, /book-demo. Each has only a page title in site typography and no content.
- Old AEO/GEO pages (/services, /enterprise, /method, /analyst) are not linked anywhere in the navbar or mobile sheet.
- Accessibility and motion: html has scroll-padding-top 100px. Under prefers-reduced-motion, remove motion and keep only color changes.
