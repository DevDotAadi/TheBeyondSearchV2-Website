# Unverifiable Items (Without Real Backend / Image Generation Component)

The following items could not be verified because they depend on external resources not present in the codebase:

## 1. Image Generation Component

The task specification states: "Call it unchanged for all creative generation" and references an image generation framework component to be pasted below the prompt. **No image generation component was provided in the codebase or prompt.** 

The current implementation uses placeholder images from `/public/ad-campaigns/` (burger-bite.webp, pasta-forks.webp, burger-cap.webp, forkandflame-favicon.webp) and simulates image loading with `setTimeout` timers. The real `Image().decode()` preload and `Promise.allSettled` pattern described in the spec is implemented structurally but calls placeholder assets rather than real generated images.

**Cannot verify without:** The actual image generation component and its API contract.

---

## 2. OAuth / Authentication

The workflow includes connecting Meta Ads and Google Ads accounts via OAuth. The current implementation uses a `USE_MOCK_OAUTH` pattern with a 1.2s fake delay and mock connected states.

**Cannot verify without:** Real OAuth endpoints, client secrets, redirect URIs, and backend token exchange.

---

## 3. Image Asset Sizes

The spec requires photos at specific sizes:
- burger-bite.webp: 172x215 (meta-feed)
- pasta-forks.webp: 179x318 (meta-story)
- burger-cap.webp: 179x318 (meta-story)
- forkandflame-favicon.webp: 28x28 (google-search)

The files in `/public/ad-campaigns/` were not individually verified for their actual dimensions. If they are not the specified sizes, images may be upscaled or downscaled, violating the "never upscale" rule.

**Cannot verify without:** Image metadata inspection of each asset file.

---

## 4. Unit Tests

The spec requires: "Unit tests for every legal and illegal state transition."

**No test files exist** in the codebase for the campaign state machine or any component.

**Cannot verify without:** Writing and running the test suite.

---

## 5. Mobile Responsiveness at 390px

The spec requires the UI to work at 390px phone width. The component includes mobile media queries (`@media (max-width: 899.98px)`) but was not tested on an actual 390px-wide device or emulator.

**Cannot verify without:** Device testing at 390px width.

---

## 6. Accessibility (WCAG)

The spec requires: keyboard accessible slider, carousel arrows, modal focus trap, Esc closes.

**Focus trapping, keyboard navigation, and ARIA patterns** were implemented structurally but not verified with a screen reader or keyboard-only testing.

**Cannot verify without:** Accessibility testing tools and screen reader validation.

---

## 7. WebVitals / Performance

Image decode performance (`Image().decode()`), LCP, and CLS were not measured.

**Cannot verify without:** Lighthouse or WebVitals measurement in a production-like environment.

---

## 8. App Icon Asset

The spec references `/public/app-icon.png` for the app icon, favicon, and dock icon. **This file does not exist** in `/public/`. The component references it but will 404 at runtime.

**Cannot verify without:** The actual `app-icon.png` asset file being added to `/public/`.

---

## 9. Backend API Endpoints

The campaign flow assumes backend endpoints for:
- Image generation
- OAuth token exchange
- Campaign launch
- Budget/payment processing

**No backend routes exist** in the codebase.

**Cannot verify without:** Deployed API endpoints and integration testing.

---

## 10. prefers-reduced-motion

The spec requires removing animation loops and shimmer under `prefers-reduced-motion`. The component checks `window.matchMedia("(prefers-reduced-motion: reduce)")` but this was not tested with the actual OS preference enabled.

**Cannot verify without:** Testing with `prefers-reduced-motion: reduce` enabled in the browser/OS.
