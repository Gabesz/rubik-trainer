<template>
  <main class="notation-page container py-5">
    <!-- Theme toggle button -->
    <button
      type="button"
      class="btn btn-link theme-toggle-notation"
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
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="d-flex align-items-center gap-3 mb-4">
          <router-link
            to="/"
            class="btn btn-link text-decoration-none d-flex align-items-center gap-2"
            title="Home"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" width="20" height="20">
              <path fill="currentColor" d="M8 0L0 8h2v8h4v-6h4v6h4V8h2z"/>
            </svg>
            <span>Home</span>
          </router-link>
        </div>
        <h1 class="h2 mb-3">Notation</h1>
        <p class="text-muted mb-4">
          Learn the Rubik's cube notation. Click the buttons to see how each move affects a solved cube.
        </p>
        <NotationView />
      </div>
    </div>
  </main>
</template>

<script setup>
import NotationView from '../components/NotationView.vue';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
.notation-page {
  padding-top: 2rem;
}

.theme-toggle-notation {
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

.theme-toggle-notation:hover {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

html[data-bs-theme="dark"] .theme-toggle-notation,
html.dark-theme .theme-toggle-notation {
  background-color: rgba(45, 45, 45, 0.9);
  color: #e0e0e0;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.3);
}

html[data-bs-theme="dark"] .theme-toggle-notation:hover,
html.dark-theme .theme-toggle-notation:hover {
  background-color: rgba(45, 45, 45, 1);
  color: #4a9eff;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
}
</style>
