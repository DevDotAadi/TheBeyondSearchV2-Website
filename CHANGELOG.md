# Changelog — "New campaign" screen rebuild

The campaign screen was rebuilt around a single typed state machine
(`components/CampaignMachine.ts` → `campaignReducer`). Every UI row, badge,
panel, and animation derives only from `campaignStage` / `stageStatus` — no
scattered booleans. Below is the mapping from each of the 10 reported bugs to
the change that fixed it.

| # | Bug (symptom) | Fix |
|---|---------------|-----|
| 1 | A solid blue rectangle sat on top of the budget bar and the chat composer input, covering the "Ask for changes" field. | Removed the offending decorative overlay element entirely. The composer is now a clean rounded glass card (`CampaignScreen` composer card) with nothing covering the input or budget bar. |
| 2 | Drafts panel header text was cut off on the right ("6 ads drafte") and the drafts area filled only ~⅓ of its width. | Header reads "4 campaigns ready" with no truncation class and full width. The review grid uses `grid grid-cols-2 gap-3 min-w-0` (and `minmax(0, 1fr)` semantics via min-width:0 on flex/grid children) so the right panel uses its full width. The shell is `overflow-x-hidden` and capped at `max-w-full` so the window never exceeds the viewport. |
| 3 | Ad cards overlapped — the second card started flush against the bottom of the first with no gap. | Ad cards render in a CSS grid with a real gap: `grid grid-cols-2 gap-3` (single column below 900px). |
| 4 | Ad images were pixelated and badly cropped. | Each image sits in a fixed aspect-ratio box with `object-fit: cover` at real ad sizes: Meta Feed 1080×1350 (4:5), Meta Story 1080×1920 (9:16), Google Display 1200×628 (~1.91:1). Images are never upscaled beyond natural size; placeholders render at natural dimensions. |
| 5 | A Feed ad image was a suggestive close-up of a person licking sauce — unrelated to the restaurant and likely Meta-rejected. | A brand-safety line is appended to every image prompt: "Show only the food and the restaurant setting. No people's faces, mouths, hands, or body close-ups. No text baked into the image. Nothing suggestive." |
| 6 | The status badge said "Live" while ads were still only drafts. | The badge follows the stage via `stageLabel`: Researching → Designing → Generating → Ready for review → Awaiting connection → Launching → Live. "Live" shows only after `LAUNCH_COMPLETE`. |
| 7 | The chat looked like the user talking to themselves (same white bubble, same side). | User messages: right-aligned, soft light-gray pill, max-width 80%. AI messages: left-aligned, no bubble, plain text on the background, with the AI avatar (white circle, two black oval eyes) beside the first line of each turn. |
| 8 | No loop or animation; the research checklist was static and already fully checked. | The research checklist streams rows one at a time: pending → active (spinner + shimmer) → done (green check), paced ~700–1800ms each, driven by the state machine (not static). The bot avatar blinks every 4–6s and shifts gaze toward the active step. |
| 9 | The header said 6 ads, only 2 rendered, and the intended number is 4. | Exactly 4 creatives are defined in state and rendered. The header reads "4 campaigns ready" and never truncates. |
| 10 | The budget was a static "Meta 60% / Google 40%" bar with no amount. | Replaced with a real budget slider ($10–$1,000, step $10, default $100), per-day/total toggle, a draggable split bar showing dollar amounts per platform, estimated reach/clicks range, editable targeting chips, and "Approve and launch" disabled until at least one creative is selected and budget > 0. |

## Files changed
- `components/CampaignMachine.ts` — new: single typed reducer, stage machine, initial state, legal transitions, retry/reset.
- `components/CampaignScreen.tsx` — new: campaign screen shell, sidebar, chat, composer, creative grid, budget panel, connection modal, launch/live views; wires ImageGenerationFramework.
- `components/CampaignMachine.test.ts` — new: 23 unit tests covering every legal and illegal state transition.
- `vitest.config.ts` — new: vitest config with `@/` path alias.
- `package.json` — added `test` script (`vitest run`) and dev dependencies.
- `app/globals.css` — added campaign layout classes and `campaign-shimmer` / `campaign-dot` keyframes (prefers-reduced-motion safe).
- `app/page.tsx` — replaced `ProductShowcase` with `CampaignScreen`.

## Not verifiable without the real backend
- The real image generation framework component (user-supplied) — currently a typed placeholder that resolves placeholder URLs; the real component must be called unchanged.
- Real OAuth for Meta Ads / Google Ads — currently mocked behind the connection flow; a `USE_MOCK_OAUTH` flag with ~1.2s fake delay is the intended path.
- Backend-tied research results (domain favicon, competitor counts, brand patterns) — currently simulated; real values require backend endpoints.
- `/public/app-icon.png` — referenced for the app icon / favicon / status orb; the file must be provided at that path (fallback CSS sphere used if absent).
