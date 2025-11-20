# Rubik's Cube Trainer PWA

Consolidated Progressive Web App for learning and drilling 3×3 Rubik's Cube algorithms: F2L (First Two Layers), OLL (Orientation of the Last Layer), and PLL (Permutation of the Last Layer). Built with Vue 3 + Vite, Vue Router, Bootstrap 5, and offline-enabled service worker via `vite-plugin-pwa`.

Demo: [https://vps.elisnails.hu/rubik-trainer/](https://vps.elisnails.hu/rubik-trainer/)

## Features

- **Three trainers in one app**: F2L (41 cases), OLL (57 cases), and PLL (21 cases) with unified UX.
- **Dark theme support**: Toggle between light and dark themes with a theme switcher in the navbar. Theme preference is saved in `localStorage` and persists across sessions.
- **Easy navigation**: Switch between trainers via dropdown menu in the header, or return to the home page. Click on algorithm names or images in list view to navigate directly to training mode for that specific algorithm.
- **Filterable lists**: Filter by case type or learned state. Offcanvas filter panel accessible via floating button (bottom-left) when filters are off-screen.
- **Sort toggle**: "Default" or "Short algs" (shortest standard algorithms first). Filter and sort choices persist per trainer in `localStorage`.
- **Editable algorithms**: Case cards show SVG diagrams, setup moves, and a single editable "Alg" field (defaults to the standard). Your edits are saved per trainer in `localStorage`.
- **Learned tracking**: One-click "Mark as learned" tracking; data persists between sessions and is separated per trainer (F2L, OLL, PLL).
- **Training mode**: Surfaces random learned cases only, supports quick re-rolls, and exits with `Esc` on desktop. Each training session has a unique URL with the algorithm ID (e.g., `/oll/oll-1`), allowing direct linking and automatic regeneration of a new random element on browser refresh.
  - **Blur effect**: When starting training via the "Training" button, the standard algorithm is blurred by default. Click to reveal/hide. This effect is not applied when navigating from list view.
  - **Quick actions**: "Back" button returns to list view, "New Training" button generates a new random case, and "Details" opens external algorithm details in a new tab. All buttons include icons for better visual recognition.
- **Responsive design**: Tuned for mobile, tablet, and desktop. Mobile navbar automatically closes when clicking menu items or clicking outside the menu, and also closes on Escape key press. No animation on mobile menu collapse for instant feedback. Theme toggle and print buttons are in the hamburger menu on mobile/tablet, and in a floating action button group on desktop.
- **Print support**: Print-friendly styles for both list view and training mode. Only algorithm cards/content are printed, with all UI elements hidden. Browser headers/footers can be disabled in print settings.
- **Installable PWA**: Full offline support with service worker caching for algorithms and SVG assets. The app works completely offline after the first visit.
- **Reset options**: "Reset Progress" clears learned items; "Reset algs" (with badge count) restores all edited algs to defaults after confirmation.
- **F2L-specific styling**: F2L trainer displays larger SVG images (110x110px) compared to OLL/PLL (120px max-width).

## Getting Started

```bash
cd rubik-trainer
npm install
# Development server
npm run dev
```

The dev server runs at `http://localhost:5173`. Vite automatically reloads on file changes. During development the service worker registers immediately; if you prefer to skip PWA caching in dev, remove or guard the `registerSW({ immediate: true })` call in `src/main.js`.

### Production Build

```bash
npm run build
npm run preview   # optional local preview after build
```

The build output lives in `rubik-trainer/dist/`. Copy that directory to your hosting provider (see deployment notes below).

## Project Structure

- `src/App.vue` – root component with `router-view`.
- `src/main.js` – Vue app initialization, Vue Router setup, and service worker registration.
- `src/views/Home.vue` – landing page with links to the three trainers.
- `src/views/Trainer.vue` – universal trainer component that handles F2L, OLL, and PLL modes via props.
- `src/components/AlgorithmCard.vue` – algorithm card with learned toggle and a unified editable "Alg" field.
- `src/components/TrainingPanel.vue` – focused training presentation.
- `src/composables/useLearned.js` – shared `localStorage` helpers for learned IDs and custom algorithms (mode-aware).
- `src/data/oll.js`, `src/data/pll.js`, `src/data/f2l.js` – data fetching modules for each trainer type.
- `public/oll/`, `public/pll/`, `public/f2l/` – trainer-specific data directories:
  - `algorithms.json` – source data (name, type, setup, standard algorithm).
  - `svg/` – SVG assets for each case.
- `src/assets/main.css` – global styling overrides and responsive tweaks, including F2L-specific image sizing.
- `vite.config.js` – Vite + PWA configuration, including `base: '/rubik-trainer/'` for subdirectory hosting.

## UI Notes

- The header includes a Bootstrap navbar with:
  - Home icon on the left (links to home page)
  - Trainer title (e.g., "OLL Trainer")
  - "Other trainers" dropdown menu (desktop: in navbar, mobile: always visible next to hamburger)
  - Action buttons (Reset algs, Reset Progress, Training/Back, New Training) in collapsible menu with icons on mobile
  - Theme toggle and Print buttons: in hamburger menu on mobile/tablet, in floating action button group on desktop (top-right)
  - Mobile menu automatically closes when clicking any menu item, clicking outside the menu, or pressing Escape
- **Navigation**: Click on algorithm names or images in list view to navigate directly to training mode for that specific algorithm. The algorithm name and image are both clickable router links.
- Training mode URLs use path parameters (e.g., `/oll/oll-1`) instead of query parameters, making them shareable and refreshable.
- **Training mode features**:
  - Standard algorithm blur effect (only when started via "Training" button, not from list view)
  - "Back" button (with icon) to return to list view
  - "New Training" button (with icon) to generate a new random case
  - "Details" button (with icon) to open external algorithm details
  - Clean card design without box-shadow for focused presentation
  - Optimized button layout for mobile: buttons fit in one row with reduced padding and smaller sizes
- Filters and sorting are duplicated in the offcanvas panel for mobile/scrolling; open it via the floating filter button at the bottom-left.
- The Standard Algorithm is emphasized in training; in cards, the editable "Alg" text is bold when displayed.
- Filter (type vs learned) is mutually exclusive by design; sort and filter selections are restored per trainer on reload.
- "Reset algs" shows a badge with the number of cases that have edited algs.
- Each trainer maintains separate `localStorage` keys (e.g., `oll-learned`, `pll-learned`, `f2l-learned`) to prevent data conflicts.
- Theme preference is stored in `localStorage` with key `theme-preference` and persists across sessions.

## Deployment Notes

- The app is configured for the subpath `https://vps.elisnails.hu/rubik-trainer/`; ensure the production bundle is uploaded to that folder and served with the same base path.
- When updating production builds, browsers may retain cached assets via the service worker. Users can pull fresh assets by reloading twice, clearing site data, or (on desktop) running `navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));` in DevTools prior to refreshing.
- If you replace or add algorithm data, drop the updated `algorithms.json` and SVGs into the appropriate `public/{trainer}/` directory and rebuild.

## Customization Tips

- Algorithm metadata lives in `public/{trainer}/algorithms.json`. To change categories or add cases, edit the JSON file and match SVG filenames. The fetch helpers derive IDs from the `name` field.
- Styling changes can go in `src/assets/main.css`. Bootstrap classes are available globally.
- Training-mode behavior is centralized in `src/views/Trainer.vue` (`startTraining`, `nextTraining`, `stopTraining`); extend these helpers to adjust selection logic or add spaced repetition rules. The training mode uses Vue Router path parameters to maintain unique URLs for each training session, enabling direct linking and automatic regeneration on refresh.
- To add a new trainer type, create a new data module in `src/data/`, add a route in `src/main.js`, and update the Trainer component's mode validator.

## License

No explicit license is provided. Adapt the code within the constraints of the project owner's requirements.

