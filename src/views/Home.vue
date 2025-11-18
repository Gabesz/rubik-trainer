<template>
  <main class="container py-5">
    <!-- Theme toggle button -->
    <button
      type="button"
      class="btn btn-link theme-toggle-home"
      @click="toggleTheme"
      :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      aria-label="Toggle theme"
    >
      <svg v-if="isDark" aria-hidden="true" viewBox="0 0 16 16" width="20" height="20">
        <path fill="currentColor" d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
      </svg>
      <svg v-else aria-hidden="true" viewBox="0 0 16 16" width="20" height="20">
        <path fill="currentColor" d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
      </svg>
    </button>
    <div class="row justify-content-center mb-4">
      <div class="col-lg-8 text-center">
        <h1 class="display-5 mb-3">Rubik's Cube F2L-OLL-PLL Trainers</h1>
        <p class="lead text-muted mb-0">
          Three focused trainers to learn and drill algorithms for 3×3:
          orientation (OLL), permutation (PLL), and first two layers (F2L).
        </p>
      </div>
    </div>

    <div class="row g-4 justify-content-center">
      <div class="col-12 col-lg-4">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">F2L Trainer</h2>
            <p class="text-muted mb-3">
              First Two Layers – practise the core 3×3 F2L cases with the same UX:
              SVG diagrams, filters, learned tracking, and custom alg notes.
            </p>
            <ul class="small text-muted mb-4">
              <li>Separated storage from the OLL/PLL apps</li>
              <li>Same filter/sort and training behaviour as the other trainers</li>
              <li>Data sourced from SpeedCubeDB's F2L set</li>
            </ul>
            <div class="mt-auto">
              <router-link to="/f2l" class="btn btn-outline-primary w-100">
                Open F2L Trainer
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">OLL Trainer</h2>
            <p class="text-muted mb-3">
              Orientation of the Last Layer – practice all 57 OLL cases with SVG diagrams,
              filters, custom alg notes, and a focused training mode.
            </p>
            <ul class="small text-muted mb-4">
              <li>Filter by case type or learned state</li>
              <li>Editable personal algorithms with local save</li>
              <li>Random training from learned cases only</li>
            </ul>
            <div class="mt-auto">
              <router-link to="/oll" class="btn btn-primary w-100">
                Open OLL Trainer
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">PLL Trainer</h2>
            <p class="text-muted mb-3">
              Permutation of the Last Layer – drill the 21 PLL cases with the same UX:
              SVG diagrams, learned tracking, and custom alg management.
            </p>
            <ul class="small text-muted mb-4">
              <li>Separate learned/progress storage from the OLL app</li>
              <li>Case-type filters and short-alg sorting</li>
              <li>Training mode focused on your learned PLLs</li>
            </ul>
            <div class="mt-auto">
              <router-link to="/pll" class="btn btn-success w-100">
                Open PLL Trainer
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: radial-gradient(circle at top, #f8f9fa 0, #e9ecef 45%, #dee2e6 100%);
  transition: background 0.3s ease;
}

html[data-bs-theme="dark"] body,
html.dark-theme body {
  background: radial-gradient(circle at top, #1a1a1a 0, #151515 45%, #0f0f0f 100%);
}

.app-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.12);
}

html[data-bs-theme="dark"] .app-card:hover,
html.dark-theme .app-card:hover {
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.5);
}

.theme-toggle-home {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1100;
  padding: 0.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  color: #212529;
}

.theme-toggle-home:hover {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

html[data-bs-theme="dark"] .theme-toggle-home,
html.dark-theme .theme-toggle-home {
  background-color: rgba(45, 45, 45, 0.9);
  color: #e0e0e0;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
}

html[data-bs-theme="dark"] .theme-toggle-home:hover,
html.dark-theme .theme-toggle-home:hover {
  background-color: rgba(45, 45, 45, 1);
  color: #4a9eff;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
}
</style>

