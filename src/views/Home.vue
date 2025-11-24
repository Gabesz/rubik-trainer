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
        <h1 class="display-4 fw-bold mb-4">Rubik's Cube Trainers</h1>
        <p class="lead mb-4">
          Master the 3×3 Rubik's Cube with three focused trainers:
        </p>
        <div class="trainer-buttons d-flex flex-column flex-md-row flex-wrap justify-content-center gap-3 mb-4">
          <button 
            type="button"
            class="btn btn-outline-primary fs-6 px-3 py-2 d-flex align-items-center justify-content-center gap-2"
            @click="scrollToTrainer('f2l')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7 11v2a1 1 0 0 1-1 1h-1v-3h2z"/>
            </svg>
            F2L - First Two Layers
          </button>
          <button 
            type="button"
            class="btn btn-primary fs-6 px-3 py-2 d-flex align-items-center justify-content-center gap-2"
            @click="scrollToTrainer('oll')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
            OLL - Orientation
          </button>
          <button 
            type="button"
            class="btn btn-success fs-6 px-3 py-2 d-flex align-items-center justify-content-center gap-2"
            @click="scrollToTrainer('pll')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
            PLL - Permutation
          </button>
        </div>
        <p class="text-muted mb-0">
          Learn algorithms, track progress, and watch interactive 3D animations.
        </p>
      </div>
    </div>

    <div class="row g-4 justify-content-center">
      <div class="col-12 col-lg-4" id="trainer-f2l">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">F2L Trainer</h2>
            <p class="text-muted mb-3">
              First Two Layers – practise the core 3×3 F2L cases with the same UX:
              SVG diagrams, filters, learned tracking, custom alg notes, and interactive 3D animations.
            </p>
            <ul class="small text-muted mb-4 list-unstyled">
              <li class="mb-2">✓ 41 F2L cases</li>
              <li class="mb-2">✓ Interactive 3D animations</li>
              <li class="mb-2">✓ Separate progress tracking</li>
              <li>✓ SpeedCubeDB data source</li>
            </ul>
            <div class="mt-auto">
              <router-link to="/f2l" class="btn btn-outline-primary w-100">
                Open F2L Trainer
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4" id="trainer-oll">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">OLL Trainer</h2>
            <p class="text-muted mb-3">
              Orientation of the Last Layer – practice all 57 OLL cases with SVG diagrams,
              filters, custom alg notes, focused training mode, and interactive 3D animations.
            </p>
            <ul class="small text-muted mb-4 list-unstyled">
              <li class="mb-2">✓ 57 OLL cases</li>
              <li class="mb-2">✓ Interactive 3D animations</li>
              <li class="mb-2">✓ Filter by type or learned state</li>
              <li>✓ Custom algorithm editor</li>
            </ul>
            <div class="mt-auto">
              <router-link to="/oll" class="btn btn-primary w-100">
                Open OLL Trainer
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4" id="trainer-pll">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">PLL Trainer</h2>
            <p class="text-muted mb-3">
              Permutation of the Last Layer – drill the 21 PLL cases with the same UX:
              SVG diagrams, learned tracking, custom alg management, and interactive 3D animations.
            </p>
            <ul class="small text-muted mb-4 list-unstyled">
              <li class="mb-2">✓ 21 PLL cases</li>
              <li class="mb-2">✓ Interactive 3D animations</li>
              <li class="mb-2">✓ Separate progress tracking</li>
              <li>✓ Case-type filters</li>
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

    <!-- GitHub Link Footer -->
    <div class="row justify-content-center mt-5 pt-4">
      <div class="col-lg-8 text-center">
        <p class="text-muted mb-2">
          <a 
            href="https://github.com/Gabesz/rubik-timer" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-decoration-none d-inline-flex align-items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>View on GitHub</span>
          </a>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

function scrollToTrainer(trainer) {
  const element = document.getElementById(`trainer-${trainer}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
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

.trainer-buttons .btn {
  min-width: 200px;
}

@media (max-width: 767.98px) {
  .trainer-buttons .btn {
    width: 100%;
  }
}
</style>

