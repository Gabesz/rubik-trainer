# RUBIK TRAINER (PWA)

Progressive Web App for learning and drilling 3×3 Rubik's Cube algorithms: Cross (intro), F2L, Advanced F2L, OLL, and PLL. Built with Vue 3 + Vite, Vue Router, Bootstrap 5, **mmenu-js** (mobile off-canvas navigation), and offline-capable service worker via `vite-plugin-pwa`. Optional **Firebase Authentication + Firestore** syncs progress when you sign in.

Demo: [https://vps.elisnails.hu/rubik-trainer/](https://vps.elisnails.hu/rubik-trainer/)

## Features

- **Trainers and pages** (each route is under the app base, e.g. `https://vps.elisnails.hu/rubik-trainer/` + path):
  - **Cross** — route `/cross` — white-cross phase: reference / tips (no numbered case list).
  - **F2L** — `/f2l` — 41 cases; universal trainer (`Trainer.vue`).
  - **Advanced F2L** — `/advanced-f2l` — 54 cases; same trainer UI as F2L, OLL, PLL; training mode: `/advanced-f2l/:algorithmId`.
  - **OLL** — `/oll` — 57 cases; universal trainer.
  - **PLL** — `/pll` — 21 cases; universal trainer.
  - **Notation** — `/notation` — **AnimCube3** (AnimCubeJS) cubes in a two-column layout; theme toggle in the page chrome.
- **Branding and home** — Landing page titled **RUBIK TRAINER**, methodology section (Cross → F2L → OLL → PLL), links to trainers and Notation, and app version display (from `src/version.js`, bumped on each production build).
- **Dark theme** — Toggle in the navbar / mobile menu; preference stored in `localStorage`.
- **Navigation** — Desktop navbar plus **mmenu-js** slide-out menu on small screens (animated hamburger-to-X toggler). Trainer dropdown and full trainer list (Cross through PLL, Notation). Modals such as the 3D cube viewer use Vue `Teleport` to `body` for correct stacking.
- **Filters and sort** — Filter by case type or state; **learned** vs **practicing** are separate: you can mark cases as “practicing” (yellow badge) independently of “learned”. Sort: default or “short algs”. Choices persist per trainer in `localStorage` (and in Firestore when logged in).
- **Editable algorithms and names** — Per-case editable algorithm text and **editable display names**; stored per mode (`localStorage` and/or cloud).
- **Training mode** — Random selection among learned cases, unique URLs with path params (e.g. `/oll/oll-1`), blur-on-start when entering via the Training button, `Esc` to exit on desktop, 3D **twisty-player** (`cubing/twisty`) modal with move highlighting and click-to-seek.
- **Account (optional)** — Sign in via Firebase to sync learned IDs, practicing IDs, custom algorithms, and custom names across devices. Without sign-in, data stays local only.
- **Responsive design** — Mobile-first layout; print-friendly styles; PWA install and offline cache after first visit.
- **Service worker** — Registered in normal browsers; **not** registered when the app runs inside an **iframe** or on **Tizen** (with cache cleanup on Tizen to avoid stale assets).

## Getting Started

```bash
cd rubik-trainer
npm install
```

Optional: copy `.env.example` to `.env` and set Firebase variables if you use authentication and Firestore (the app runs without them for local-only usage).

```bash
cp .env.example .env   # Unix/macOS; on Windows copy the file manually or: Copy-Item .env.example .env
```

```bash
npm run dev
```

The dev server runs at `http://localhost:5173`. Vite hot-reloads on changes. The service worker may register in dev; to avoid PWA caching while developing, you can guard or remove `registerSW({ immediate: true })` in `src/main.js`.

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Runs `prebuild` (increments version in `src/version.js`) then production build |
| `npm run preview` | Local preview of `dist/` |
| `npm run generate:af2l-svgs` | Regenerate Advanced F2L SVG assets (`scripts/generate-af2l-svgs.mjs`) |

### Production Build

```bash
npm run build
npm run preview   # optional local preview after build
```

Output: `dist/`. Deploy that folder under the configured base path (see below).

## Project Structure

- `src/main.js` — Vue app, router (`/rubik-trainer/` base), routes, PWA registration (with iframe/Tizen exceptions).
- `src/App.vue` — Root shell with `router-view`.
- `src/views/Home.vue` — Landing (RUBIK TRAINER, trainer cards, methodology).
- `src/views/Trainer.vue` — Universal trainer for `oll`, `pll`, `f2l`, `af2l`.
- `src/views/Cross.vue` — Cross reference page.
- `src/views/Notation.vue` — Notation page wrapping `NotationView`.
- `src/components/AlgorithmCard.vue`, `TrainingPanel.vue`, `RubikCube3D.vue`, `NotationView.vue`, `AuthModal.vue`, `UserIcon.vue`, `AnimatedNavTogglerIcon.vue` — UI pieces.
- `src/composables/useLearned.js` — Learned / practicing / custom algs / custom names; `localStorage` + Firebase when authenticated.
- `src/composables/useAuth.js`, `useUserData.js`, `src/config/firebase.js` — Auth and Firestore user data.
- `src/composables/useMmenuNav.js` — Mobile mmenu wiring.
- `src/data/*-algorithms.json` — Bundled algorithm definitions (imported by `oll.js`, `pll.js`, `f2l.js`, `af2l.js`).
- `public/oll/`, `public/pll/`, `public/f2l/` — SVG (and any legacy assets) per trainer; `public/af2l/svg/` — Advanced F2L SVGs; `public/cross/` — Cross reference image(s).
- `scripts/increment-version.js` — Prebuild version bump; `scripts/generate-af2l-svgs.mjs` — AF2L SVG pipeline.
- `vite.config.js` — Vite + PWA; `base: '/rubik-trainer/'` for subdirectory hosting.

## UI Notes

- **Mobile**: mmenu off-canvas menu lists Home, trainers, Notation, user account row, theme, print; Bootstrap’s top navbar is complemented by the slide-out panel.
- **3D cube (trainers)**: `cubing/twisty` web component; algorithm text supports grouped parentheses / word wrap as before.
- **Notation page**: External **AnimCube3** script for classic animated cube demos (two-column layout).
- Training URLs use path parameters for shareability and refresh behavior.
- Per-trainer storage keys remain mode-prefixed (e.g. `oll-learned`, `oll-practicing`, …) so modes do not clash.

## Deployment Notes

- Production base path: `https://vps.elisnails.hu/rubik-trainer/` — upload `dist/` to that path.
- After deployments, users may need a hard refresh or cache clear if the service worker serves old bundles.
- Firebase: configure the same `VITE_*` variables in your hosting environment for production builds that use auth.

## Customization Tips

- Edit algorithm data in `src/data/*-algorithms.json` (and rebuild). Match SVG filenames under `public/{trainer}/` / `public/af2l/svg/` as required by the loaders in `src/data/*.js`.
- Styling: `src/assets/main.css` and Bootstrap utilities.
- Training selection logic: `src/views/Trainer.vue` (`startTraining`, `nextTraining`, `stopTraining`).
- New trainer mode: add JSON + `src/data` module, route in `main.js`, and extend `Trainer` mode handling.

## License

No explicit license is provided. Adapt the code within the constraints of the project owner’s requirements.
