<template>
  <div class="notation-layout rt-page">
    <nav
      class="navbar navbar-expand-lg fixed-top rt-navbar rt-navbar--neon border-0"
      :class="isDark ? 'navbar-dark' : 'navbar-light'"
    >
      <div class="container-fluid rt-navbar-inner px-3 px-lg-4">
        <router-link to="/" class="rt-navbar-brand" title="Home">RUBIK TRAINER</router-link>

        <div class="d-flex align-items-center gap-2 ms-auto d-lg-none">
          <div class="dropdown">
            <a
              class="nav-link dropdown-toggle py-1 small"
              href="#"
              id="notationTrainerDropdownMobile"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Trainers
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notationTrainerDropdownMobile">
              <li>
                <router-link to="/f2l" class="dropdown-item">F2L</router-link>
              </li>
              <li>
                <router-link to="/oll" class="dropdown-item">OLL</router-link>
              </li>
              <li>
                <router-link to="/pll" class="dropdown-item">PLL</router-link>
              </li>
            </ul>
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#notationNavbarNav"
            aria-controls="notationNavbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div
          class="collapse navbar-collapse align-items-lg-center flex-lg-grow-1 w-100"
          id="notationNavbarNav"
          @click="closeNavbarIfMobile"
        >
          <ul
            class="navbar-nav rt-navbar-pills mx-lg-auto align-items-lg-center flex-column flex-lg-row gap-1 gap-lg-3 py-3 py-lg-0"
          >
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/f2l">F2L</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/oll">OLL</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/pll">PLL</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill rt-nav-pill--active" to="/notation">Notation</router-link>
            </li>
          </ul>

          <ul
            class="navbar-nav ms-lg-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2"
          >
            <li class="nav-item d-none d-lg-block">
              <button
                type="button"
                class="btn rt-navbar-icon-btn"
                @click="toggleTheme"
                :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
                aria-label="Toggle theme"
              >
                <svg v-if="isDark" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
                  />
                </svg>
                <svg v-else aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"
                  />
                </svg>
              </button>
            </li>
            <li class="nav-item d-none d-lg-block">
              <button
                type="button"
                class="btn rt-navbar-icon-btn"
                @click="handlePrint"
                title="Print"
                aria-label="Print"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"
                  />
                  <path
                    fill="currentColor"
                    d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
                  />
                </svg>
              </button>
            </li>
            <li class="nav-item d-none d-lg-block rt-navbar-user-item">
              <UserIcon unique-id="notation" />
            </li>
            <li class="nav-item d-lg-none">
              <UserIcon
                unique-id="notation-mobile"
                class="mobile-menu-user-icon"
                :close-mobile-navbar="closeNavbar"
              />
            </li>
            <li class="nav-item d-lg-none">
              <a
                class="nav-link d-flex align-items-center gap-2"
                href="#"
                @click.prevent="handleNavClick(toggleTheme)"
                :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
              >
                <svg v-if="isDark" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
                  />
                </svg>
                <svg v-else aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"
                  />
                </svg>
                <span>{{ isDark ? 'Light theme' : 'Dark theme' }}</span>
              </a>
            </li>
            <li class="nav-item d-lg-none">
              <a
                class="nav-link d-flex align-items-center gap-2"
                href="#"
                @click.prevent="handleNavClick(handlePrint)"
                title="Print"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"
                  />
                  <path
                    fill="currentColor"
                    d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
                  />
                </svg>
                <span>Print</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="rt-navbar-sheen" aria-hidden="true"></div>
    </nav>

    <main class="notation-page container py-5 rt-page">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <h1 class="h2 mb-3">Notation</h1>
          <p class="text-muted mb-4">
            Learn the Rubik's cube notation. Click the buttons to see how each move affects a solved cube.
          </p>
          <NotationView />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import NotationView from '../components/NotationView.vue';
import UserIcon from '../components/UserIcon.vue';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

function handlePrint() {
  window.print();
}

function closeNavbarIfMobile() {
  if (typeof window !== 'undefined' && window.innerWidth < 992) {
    closeNavbar();
  }
}

function closeNavbar() {
  const navbarCollapse = document.getElementById('notationNavbarNav');
  const navbarToggler = document.querySelector('[data-bs-target="#notationNavbarNav"]');
  if (navbarCollapse && navbarToggler && navbarCollapse.classList.contains('show')) {
    if (window.bootstrap?.Collapse) {
      const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        navbarCollapse.classList.remove('show');
        navbarToggler.setAttribute('aria-expanded', 'false');
      }
    } else {
      navbarCollapse.classList.remove('show');
      navbarToggler.setAttribute('aria-expanded', 'false');
    }
  }
}

function handleNavClick(callback) {
  callback();
  closeNavbar();
}

function handleKeydown(event) {
  if (event.key === 'Escape' && window.innerWidth < 992) {
    const navbarCollapse = document.getElementById('notationNavbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      event.preventDefault();
      closeNavbar();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.notation-layout {
  padding-top: 5.25rem;
}

.notation-page {
  padding-top: 0;
}
</style>
