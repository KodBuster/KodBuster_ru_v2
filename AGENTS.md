# KodBuster v2 — agent operating guide

## Mission

Build KodBuster as a distinctive, high-converting Russian-language web studio site. The result must feel art-directed rather than template-generated, while remaining fast, accessible, responsive, and fully functional.

## Repository layout

- This repository root is the maintainable Next.js App Router + TypeScript source.
- Make product changes in `src/`; place optimized public assets in `public/`.
- GitHub Pages is served below `/KodBuster_ru_v2/`; `next.config.ts` reads `NEXT_PUBLIC_BASE_PATH` for deployment.
- Use `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e` from the repository root.

## Required workflow

1. Inspect repository state, content, assets, deployment path, and git status.
2. State the primary conversion goal and target visitor before choosing visuals.
3. Define typography, color, spacing, grid, motion language, and image treatment before building.
4. Never invent proof, clients, results, prices, metrics, or testimonials.
5. Build the narrative around one primary action; secondary actions must not compete with it.
6. Build a complete vertical slice first: navigation, hero, one proof/interaction, CTA, and mobile state.
7. Motion must improve comprehension, brand perception, or conversion and have a reduced-motion fallback.
8. Verify rendered behavior in a real browser; source review alone is not acceptance.
9. Fix failures, rerun checks, and report only checks actually performed.

## Art direction

- Start from the business and audience, not a fashionable component library.
- Avoid gradient blobs, excessive glass cards, uniform rounded rectangles, random neon, and identical section rhythms.
- Every section needs a distinct job in the conversion story.
- Use one deliberate palette and a strong typographic hierarchy.
- Write Russian copy for people; avoid jargon, empty superlatives, and unsupported claims.
- Treat mobile as an intentional composition, not a collapsed desktop page.
- Preserve legibility over spectacle.

## Acceptance gates

- Header, navigation, mobile menu, anchors, links, buttons, forms, accordions, sliders, and modal controls work.
- Every CTA has a real destination or clearly implemented action.
- Keyboard navigation, visible focus, semantic landmarks, meaningful alt text, and contrast are checked.
- `prefers-reduced-motion` is respected.
- No horizontal overflow or clipped content at 360x800, 390x844, 768x1024, 1280x800, and 1440x900.
- No console errors, broken assets, or incorrect `/KodBuster_ru_v2/` paths.
- Capture desktop and mobile screenshots and inspect them visually before handoff.

## Release rules

- Preserve user-authored changes and avoid unrelated rewrites.
- Prefer reproducible source changes over hand-edited output.
- Keep secrets and private endpoints out of the repository.
- Do not publish, change DNS, or replace production without explicit approval.
- Use a feature branch for substantial work.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
