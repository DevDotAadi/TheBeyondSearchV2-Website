# Product Showcase Bug-Fix Plan

## Context
The product showcase scene (`components/ProductShowcase.tsx` + `app/globals.css`) has multiple bugs causing:
- Scene stuck at ~83% scale inside 976px container instead of breaking out to 1120px
- Review panel renders nothing in any frame
- Hydration mismatch from `Math.cos`/`Math.sin` floating point in Safari/Claude icon SVGs
- Dock uses image files (ChatGPT, Chrome, OpenAI, Trash PNG) instead of inline SVGs
- Wrong dock icon set (has ChatGPT, Chrome, OpenAI; missing Safari, Codex)
- Wallpaper has no fallback layers
- White-on-white bot mark in notification banner
- Scattered per-element timers instead of single timeline hook

## Files to modify
- `components/ProductShowcase.tsx` — component rewrite (timeline hook, dock icons, review panel always-render)
- `app/globals.css` — CSS fixes (scene width, wallpaper fallback, dock SVGs, title bar, banner icon)
- `AGENTS.md` — documentation update

---

## Step 0: Find and fix all errors

### Error: public/showcase/ is empty
The directory `/Users/AdityaSingh/Desktop/TheBeyondSearchV2/public/showcase/` exists but is empty (0 bytes, no files). The component references `/ad-campaigns/` paths which exist and return 200. No action needed on image paths since they already point to `/ad-campaigns/`. But we must **not** reference `/showcase/` anywhere.

### Error: Hero wallpaper path
`--wallpaper-url: "/hero-background.webp"` in `app/globals.css:29`. File exists at `public/hero-background.webp` (referenced in `app/page.tsx:11`). Confirmed by file listing.

### Error: Hydration mismatch
SafariIcon and ClaudeIcon (previous inline SVG versions) used `Math.cos`/`Math.sin` producing different float values on server vs client. Current code removed those inline SVGs and uses image files instead, so this specific error is resolved. But the new plan must ensure any inline SVG math uses deterministic values.

### Action items:
- [ ] Verify no remaining `Math.cos`/`Math.sin` in inline SVGs (use fixed coordinate values instead)
- [ ] Confirm all image imports in component return 200 (already verified for `/ad-campaigns/` paths)
- [ ] Remove any references to `/showcase/` paths

---

## Step 1: Scene width and scale

### Root cause
`.product-device-wrap` (globals.css:356-362) has `max-width: var(--showcase-max)` where `--showcase-max: 928px` (globals.css:9). This keeps the entire scene inside the 976px container. The scene needs to break out to 1120px wide.

### Fix
In `app/globals.css`:
1. Change `--showcase-max` from `928px` to `1120px`
2. Change `.product-device-wrap` to:
   ```css
   .product-device-wrap {
     width: min(1120px, calc(100% - 48px));
     margin-inline: auto;
     margin-top: 40px;
     position: relative;
   }
   ```
   Remove `max-width` constraint.
3. Move `.scene-wrap` to be a direct child of the section (sibling of `.site-container`), not inside `.product-device-wrap`. The header and three-points row stay inside `.site-container`.

### Verification
- At 1275px viewport: `--s` = min(1, 1120/1120) = 1, `.scene-wrap` measures 1120px wide
- At 1024px viewport: `--s` = min(1, 976/1120) ≈ 0.87, scales down proportionally

---

## Step 2: Wallpaper (scene must never be white)

### Root cause
`.desktop` background (globals.css:382) is just `var(--wallpaper-url) center 68% / cover` with no fallback. If image fails or is slow, scene shows white or container background.

### Fix
In `app/globals.css`, change `.desktop` background to:
```css
background:
  var(--wallpaper-url) center 68% / cover no-repeat,
  radial-gradient(60% 70% at 15% 20%, #8ebcff 0%, transparent 60%),
  radial-gradient(55% 65% at 85% 25%, #c9b6ff 0%, transparent 62%),
  linear-gradient(160deg, #b9d4f7 0%, #dbe7fb 55%, #eaf0ff 100%);
```

### Verification
- Computed `background-image` in DevTools contains the hero URL
- Image returns 200
- Scene visibly shows landscape with glass window blurring it
- Scene edge visible on white page via 1px border + large shadow (already present)

---

## Step 3: One timeline (no independent timers or CSS delays)

### Root cause
Current component has 17+ separate `useState` flags and individual `setTimeout` calls scattered throughout `useEffect`. This causes timing drift, React StrictMode double-invocation issues, and per-element animation delays.

### Fix
In `components/ProductShowcase.tsx`:
1. Create `useShowcaseTimeline` hook returning a single state object:
   ```ts
   {
     dockBounce: boolean,
     windowOpen: boolean,
     promptWords: number,      // 0 to 6
     sent: boolean,
     panel: boolean,
     steps: number,            // 0 to 4
     creative1: boolean,
     creative2: boolean,
     creative3: boolean,
     google: boolean,
     label: boolean,           // "6 ads drafted"
     summary: boolean,
     chips: boolean,
     budget: boolean,
     tiles: boolean,
     approveHover: boolean,
     approvePressed: boolean,
     live: boolean,
     banner: boolean,
   }
   ```
2. Single ordered list of `[timeMs, patch]` entries scheduled by chained `setTimeout`s
3. All timers cleared on cleanup and reset (StrictMode safe)
4. Every visible element reads ONLY these flags (`className: { flag && "is-in" }`)
5. Remove every per-element `animation-delay` that decides when something appears

### Schedule (ms):
| Time | Action |
|------|--------|
| 300 | dockBounce = true |
| 650 | dockBounce = false |
| 1000 | windowOpen = true |
| 1600 | promptWords = 1 |
| +140 per word | promptWords increments |
| 3500 | sent = true |
| 3650 | sent = false |
| 3600 | promptWords → user bubble transition |
| 4000 | panel = true (skeletons visible, pill = Draft) |
| 4400 | steps = 1 |
| 5100 | steps = 2 |
| 5600 | creative1 = true |
| 5800 | creative2 = true, steps = 3 |
| 6000 | creative3 = true |
| 6300 | google = true, label = true |
| 6500 | steps = 4 |
| 7200 | summary = true |
| 7500 | chips = true |
| 7800 | budget = true |
| 8200 | tiles = true (count-up over 1.2s) |
| 10200 | approveHover = true |
| 10800 | approveHover = false, approvePressed = true |
| 11000 | live = true, banner = true |
| 14000 | banner = false |
| 15200 | windowOpen = false |
| 15800 | reset all flags to false |
| 16400 | loop |

### Rules:
- Nothing from a later step visible before an earlier step (chips/budget/summary only after steps=4; banner/Live only after panel has content)
- Start only when 35% of scene visible (IntersectionObserver), pause when leaves view
- `prefers-reduced-motion`: apply final state at once, no loop

---

## Step 4: Review panel must always render

### Root cause
Review panel visibility is toggled via CSS class `review-open` on a parent. When panel flag is false, the entire aside is hidden/opacity 0. Need to restructure so the panel container always renders, but inner content shows skeletons before flags.

### Fix
In `components/ProductShowcase.tsx`:
1. Review panel container always in DOM (opacity/transform controlled by `panel` flag)
2. Tabs row visible as soon as `panel` flag true
3. "6 ads drafted" label appears with `label` flag
4. Creatives row shows skeleton blocks (same size, `rgba(15,17,21,0.06)`, matching radius, shimmer) before their flags
5. Each creative crossfades to real element when its flag turns true
6. Photos: `next/image` with explicit width/height, preloaded and decoded before timeline starts
7. Timeline starts after `Promise.allSettled` of image decode; failed image keeps dark placeholder but everything else renders

### Stray light-blue block fix
Find and eliminate any unstyled color block (~590px wide) at bottom right of review panel or under dock. Likely causes:
- Skeleton with no size constraints expanding to fill space
- `bg-[#EEF2F4]` section background leaking through
- Image placeholder with no width/height
- Button hover layer not constrained

Fix: ensure all skeletons have explicit width/height matching their real elements; all images have explicit dimensions; no unstyled `div` with background color.

---

## Step 5: Window chrome

### Root cause 1: Title bar height collapsed
`.window-titlebar` has `flex: 0 0 44px` but may be getting squeezed by flex layout.

### Fix 1
Set `.window-titlebar` to:
```css
.window-titlebar {
  flex: none;
  height: 44px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  ...
}
```
Ensure `.window-body` uses `min-height: 0` and `display: flex` so it cannot squeeze the title bar.

### Root cause 2: White-on-white bot mark in banner
`.banner-bot-mark` (globals.css:1115-1125) has `background: #fff` — white circle on the banner's light background.

### Fix 2
Replace `.banner-bot-mark` with the Beyond Search dock icon (blue squircle) at 28px:
```html
<div className="banner-bot-mark">
  <svg viewBox="0 0 48 48" className="w-[28px] h-[28px]">...</svg>
</div>
```
Using the same inline SVG as the dock's Beyond Search icon.

---

## Step 6: Dock (exact icon set, inline SVG only)

### Root cause
Dock currently shows: BotMark (Beyond Search), Claude image, ChatGPT image, Chrome image, divider, Trash PNG image.
Spec requires: Safari, Claude, Beyond Search (running dot), Codex, divider, Trash — ALL inline SVG, no image files, no Chrome, no OpenAI logo.

### Fix
Replace dock contents in `components/ProductShowcase.tsx`:

1. **Safari** — inline SVG per spec (with `sf-bg`, `sf-ring`, `sf-gl` gradients, unique prefixed IDs)
2. **Claude** — inline SVG per spec (with `cl-bg`, `cl-gl` gradients)
3. **Beyond Search** — inline SVG per spec (with `bs-bg`, `bs-gl` gradients) + running dot below
4. **Codex** — inline SVG per spec (with `cx-bg`, `cx-gl` gradients)
5. **Divider** — 1px x 44px `rgba(0,0,0,0.18)`
6. **Trash** — inline SVG per spec (not a squircle, `tr-g` gradient)

All SVG IDs must be unique/prefixed (e.g., `dock-sf-bg`, `dock-cl-bg`, etc.) to avoid conflicts when multiple icons render.

### CSS updates
- `.dock-item img, .dock-item svg` — keep `width: 48px`, `height: 48px`, `filter: drop-shadow(0 2px 5px rgba(15,23,42,0.22))`
- Running dot sits under Beyond Search only
- Dock stays above window (z-index: 20)

---

## Step 7: Verify with frames

### Frame checks (after scene enters view):
| Time | Expected |
|------|----------|
| 0.5s | Wallpaper, menu bar, dock visible; Beyond Search icon bouncing; no window |
| 2.0s | Window open; centered composer with prompt words appearing; nothing else |
| 4.2s | Chat pane on side with user bubble; review panel visible with tabs, skeletons, control row; steps 0→1 |
| 6.5s | Steps up to 3-4 visible; burger-bite feed photo + both story photos visible; Google ad visible; "6 ads drafted" showing; tiles still skeleton |
| 9.0s | Summary, targeting chips, budget bar visible; tiles with numbers; all three photos visible; nothing under dock |
| 11.5s | Status "Live"; banner visible with blue app icon; Approve & launch pressed |
| 15.5s | Window gone; wallpaper and dock only |

### Additional checks:
- No horizontal scroll at 1275px
- No console errors
- No light-blue block anywhere

---

## AGENTS.md updates
Update the "Product showcase" section:
- Scene lives outside the 976px container (`.product-device-wrap` width min(1120px, 100% - 48px))
- Wallpaper fallback layering (4-layer background stack)
- Single-timeline rule (no per-element reveal delays, one `useShowcaseTimeline` hook)
- Skeleton behavior (rgba(15,17,21,0.06), matching radius, shimmer, crossfade)
- Fixed dock icon set and inline SVG sources (Safari, Claude, Beyond Search, Codex, divider, Trash)
- 44px title bar rule (flex none, height 44px, box-sizing border-box)
- Frame-check list (0.5s through 15.5s)

---

## Risks
- React StrictMode double-invocation could double-schedule timers — mitigated by clearing all timers in cleanup and using ref-based guard
- Image decode failures — mitigated by `Promise.allSettled` and placeholder colors
- SVG ID conflicts — mitigated by unique prefixed IDs (`dock-sf-bg`, etc.)
