<template>
  <div class="cross-layout rt-page">
    <nav
      class="navbar navbar-expand-lg fixed-top rt-navbar rt-navbar--neon border-0"
      :class="isDark ? 'navbar-dark' : 'navbar-light'"
    >
      <div class="container rt-navbar-inner">
        <router-link to="/" class="rt-navbar-brand" title="Home">RUBIK TRAINER</router-link>

        <div class="d-flex align-items-center gap-2 ms-auto d-lg-none">
          <div class="dropdown">
            <a
              class="nav-link dropdown-toggle py-1 small"
              href="#"
              id="crossTrainerDropdownMobile"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Trainers
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="crossTrainerDropdownMobile">
              <li>
                <router-link to="/cross" class="dropdown-item active">Cross</router-link>
              </li>
              <li>
                <router-link to="/f2l" class="dropdown-item">F2L</router-link>
              </li>
              <li>
                <router-link to="/advanced-f2l" class="dropdown-item">Advanced F2L</router-link>
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
            ref="mmenuTogglerRef"
            class="navbar-toggler"
            type="button"
            aria-controls="cross-mmenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
            @click.prevent="openMobileMenu"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div
          class="navbar-collapse d-none d-lg-flex align-items-lg-center flex-lg-grow-1 w-100"
          id="crossNavbarNav"
          @click="closeNavbarIfMobile"
        >
          <ul
            class="navbar-nav rt-navbar-pills align-items-lg-center flex-column flex-lg-row gap-1 gap-lg-3 py-3 py-lg-0"
          >
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill rt-nav-pill--active" to="/cross">Cross</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/f2l">F2L</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/advanced-f2l">Advanced F2L</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/oll">OLL</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/pll">PLL</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link rt-nav-pill" to="/notation">Notation</router-link>
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
              <UserIcon unique-id="cross" />
            </li>
          </ul>
        </div>
      </div>
      <div class="rt-navbar-sheen" aria-hidden="true"></div>
    </nav>

    <nav
      id="cross-mmenu"
      ref="mmenuNavRef"
      class="rt-mmenu-source"
      aria-hidden="true"
      @click.capture="closeNavbarIfMobile"
    >
      <ul>
        <li>
          <router-link class="rt-mmenu-link" to="/">Home</router-link>
        </li>
        <li>
          <router-link class="rt-mmenu-link rt-mmenu-link--active" to="/cross">Cross</router-link>
        </li>
        <li>
          <router-link class="rt-mmenu-link" to="/f2l">F2L</router-link>
        </li>
        <li>
          <router-link class="rt-mmenu-link" to="/advanced-f2l">Advanced F2L</router-link>
        </li>
        <li>
          <router-link class="rt-mmenu-link" to="/oll">OLL</router-link>
        </li>
        <li>
          <router-link class="rt-mmenu-link" to="/pll">PLL</router-link>
        </li>
        <li>
          <router-link class="rt-mmenu-link" to="/notation">Notation</router-link>
        </li>
        <li>
          <span class="rt-mmenu-user-host">
            <UserIcon
              unique-id="cross-mobile"
              class="mobile-menu-user-icon"
              :close-mobile-navbar="closeNavbar"
            />
          </span>
        </li>
        <li>
          <a
            class="rt-mmenu-link"
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
        <li>
          <a
            class="rt-mmenu-link"
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
    </nav>

    <main class="cross-page container py-5 rt-page">
      <div class="row">
        <div class="col-12">
          <h1 class="h2 mb-3">White cross</h1>
          <p class="text-muted mb-4 cross-page__lead">
            The first step of CFOP: place four white edges on the bottom so each edge matches the center on its
            side. Think in <strong>pieces</strong>, not faces — every edge has two stickers that must line up with
            the right centers.
          </p>

          <figure class="cross-page__figure">
            <img
              :src="crossImageUrl"
              alt="Yellow center with white edges arranged around it (daisy pattern)"
              class="cross-page__img img-fluid rounded"
              width="640"
              height="640"
              loading="lazy"
            />
            <figcaption class="cross-page__caption text-muted small mt-2">
              Beginner-friendly setup: white edges around the yellow center (daisy), before transferring them to
              the white face.
            </figcaption>
          </figure>

          <section class="cross-page__section" aria-labelledby="cross-goal">
            <h2 id="cross-goal" class="h4 mt-4">1. What “good” means</h2>
            <p>
              A solved cross has all white stickers on the bottom (white center), and the outer colors of the four
              edges match the side centers — green next to green center, red next to red, and so on. If an edge sits
              on the bottom but its side color does not match that face’s center, the cross is not fully correct yet.
            </p>
          </section>

          <section class="cross-page__section" aria-labelledby="cross-daisy">
            <h2 id="cross-daisy" class="h4 mt-4">2. The daisy (beginner strategy)</h2>
            <p>
              Instead of forcing the cross on white immediately, many beginners first form a
              <strong>daisy</strong>: all four white edges on the top layer, each touching the
              <strong>yellow</strong> center. Side colors do not need to match yet.
            </p>
            <ol class="cross-page__steps">
              <li>Find a white edge.</li>
              <li>Move it to the top layer so it sits beside the yellow center.</li>
              <li>Repeat until all four white edges form the daisy.</li>
            </ol>
          </section>

          <section class="cross-page__section" aria-labelledby="cross-transfer">
            <h2 id="cross-transfer" class="h4 mt-4">3. Moving down to the white face</h2>
            <p>With the daisy ready, move each “petal” to the bottom in turn:</p>
            <ol class="cross-page__steps">
              <li>Look at the <strong>non-white</strong> sticker on one edge (e.g. white–green).</li>
              <li>
                Turn the top layer (<code class="cross-page__code">U</code>) until that color lines up with its
                center (green on green).
              </li>
              <li>
                Turn that face twice (<code class="cross-page__code">F2</code> if the edge is in front) to send the
                edge to the bottom. It should land with white on the bottom and the side color aligned.
              </li>
              <li>Repeat for the other three edges without destroying finished edges (usually work on one edge at a time).</li>
            </ol>
          </section>

          <section class="cross-page__section" aria-labelledby="cross-flip">
            <h2 id="cross-flip" class="h4 mt-4">4. Flipped edge on the front</h2>
            <p>
              Sometimes an edge is in the right slot but <strong>twisted</strong>: white is on the side and the
              other color is on the bottom. For a flipped edge on the front face, this short sequence reorients it:
            </p>
            <p class="cross-page__alg">
              <code>F' U L' U'</code>
            </p>
            <p class="text-muted small">
              Adjust cube orientation so the bad edge is in the front–bottom position before applying the moves.
            </p>
          </section>

          <section class="cross-page__section" aria-labelledby="cross-colors">
            <h2 id="cross-colors" class="h4 mt-4">5. Color order (memory aid)</h2>
            <p>With white on bottom and yellow on top (standard color scheme):</p>
            <ul class="cross-page__bullets">
              <li><strong>B</strong>lue is opposite <strong>G</strong>reen.</li>
              <li><strong>R</strong>ed is opposite <strong>O</strong>range.</li>
              <li>
                Going clockwise around the sides: <strong>red → blue → orange → green</strong> (often remembered as
                “around the cube”).
              </li>
            </ul>
          </section>

          <p class="mt-4 mb-0">
            <router-link to="/f2l" class="cross-page__next">Continue to F2L →</router-link>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import UserIcon from '../components/UserIcon.vue';
import { useMmenuNav } from '../composables/useMmenuNav';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

const crossImageUrl = computed(() => `${import.meta.env.BASE_URL}cross/reference.png`);

const mmenuNavRef = ref(null);
const mmenuTogglerRef = ref(null);
const { open: openMobileMenu, close: closeMmenu, isOpen: isMobileMenuOpen } = useMmenuNav({
  menuElRef: mmenuNavRef,
  isDark,
  togglerRef: mmenuTogglerRef,
});

function handlePrint() {
  window.print();
}

function closeNavbarIfMobile() {
  if (typeof window !== 'undefined' && window.innerWidth < 992) {
    closeNavbar();
  }
}

function closeNavbar() {
  closeMmenu();
}

function handleNavClick(callback) {
  callback();
  closeNavbar();
}

function handleKeydown(event) {
  if (event.key === 'Escape' && window.innerWidth < 992 && isMobileMenuOpen()) {
    event.preventDefault();
    closeNavbar();
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
.cross-layout {
  padding-top: 5.25rem;
}

.cross-page {
  padding-top: 0;
}

.cross-page__lead {
  line-height: 1.6;
}

.cross-page__figure {
  margin: 1.5rem 0 2rem;
  text-align: center;
}

.cross-page__img {
  max-width: min(100%, 42rem);
  height: auto;
  border: 1px solid var(--rt-glass-border);
  box-shadow: var(--rt-shadow-card);
}

.cross-page__section p,
.cross-page__section li {
  color: var(--rt-color-on-surface-variant);
  line-height: 1.65;
}

.cross-page__steps {
  padding-left: 1.25rem;
}

.cross-page__steps li {
  margin-bottom: 0.35rem;
}

.cross-page__bullets {
  margin: 0;
  padding-left: 1.25rem;
}

.cross-page__code {
  font-size: 0.95em;
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
  background: var(--rt-color-surface-high);
  color: var(--rt-color-on-surface);
}

.cross-page__alg {
  margin: 1rem 0;
}

.cross-page__alg code {
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  padding: 0.5rem 0.85rem;
  border-radius: var(--rt-radius-md);
  background: var(--rt-color-surface-high);
  border: 1px solid var(--rt-glass-border);
  color: var(--rt-color-primary-mid);
}

.cross-page__next {
  font-weight: 600;
  text-decoration: none;
  color: var(--rt-color-primary-mid);
}

.cross-page__next:hover {
  text-decoration: underline;
}
</style>
