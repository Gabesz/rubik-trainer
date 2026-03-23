<template>
  <main class="rt-landing">
    <div class="rt-landing__ambient" aria-hidden="true" />

    <button
      type="button"
      class="rt-theme-toggle"
      @click="toggleTheme"
      :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      aria-label="Toggle theme"
    >
      <svg v-if="isDark" aria-hidden="true" viewBox="0 0 16 16" width="20" height="20">
        <path
          fill="currentColor"
          d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
        />
      </svg>
      <svg v-else aria-hidden="true" viewBox="0 0 16 16" width="20" height="20">
        <path
          fill="currentColor"
          d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"
        />
      </svg>
    </button>

    <div class="container rt-landing__wrap py-4 py-md-5">
      <header class="rt-landing__hero rt-landing-reveal">
        <p class="rt-landing__eyebrow">RUBIK TRAINER</p>
        <h1 class="rt-landing__title">
          <span class="rt-landing__title-line">RUBIK</span>
          <span class="rt-landing__title-line rt-landing__title-line--accent">TRAINER</span>
        </h1>
        <p class="rt-landing__lead">
          Master the architecture of speed. Advanced algorithmic training for the next generation of
          speedcubers — F2L, OLL, and PLL with SVG cases, progress tracking, and 3D animations.
        </p>
        <div class="rt-landing__hero-actions">
          <button type="button" class="rt-landing__cta-primary" @click="scrollToCoreTrainers">
            Start solving
          </button>
          <span class="rt-landing__version">v{{ appVersion }}</span>
        </div>
      </header>

      <section class="rt-landing__methodology rt-landing-reveal rt-landing-reveal--delay-2" aria-labelledby="method-heading">
        <div class="rt-landing__section-head">
          <h2 id="method-heading" class="rt-landing__section-title">Methodology</h2>
          <router-link to="/notation" class="rt-landing__link-arrow">
            Notation
            <span class="rt-landing__link-arrow-icon" aria-hidden="true">→</span>
          </router-link>
        </div>
        <div class="rt-landing__phases">
          <article class="rt-landing__phase">
            <span class="rt-landing__phase-label">Phase 01</span>
            <h3 class="rt-landing__phase-title">Cross</h3>
            <p class="rt-landing__phase-desc">
              Foundational four-edge alignment on the base layer (intuitive).
            </p>
          </article>
          <article class="rt-landing__phase">
            <span class="rt-landing__phase-label">Phase 02</span>
            <h3 class="rt-landing__phase-title">
              <a href="#trainer-f2l" class="rt-landing__phase-link" @click.prevent="scrollToTrainer('f2l')"
                >F2L</a
              >
            </h3>
            <p class="rt-landing__phase-desc">First two layers — pair and insert corner–edge pairs.</p>
          </article>
          <article class="rt-landing__phase">
            <span class="rt-landing__phase-label">Phase 03</span>
            <h3 class="rt-landing__phase-title">
              <a href="#trainer-oll" class="rt-landing__phase-link" @click.prevent="scrollToTrainer('oll')"
                >OLL</a
              >
            </h3>
            <p class="rt-landing__phase-desc">Orient last layer — all 57 cases.</p>
          </article>
          <article class="rt-landing__phase">
            <span class="rt-landing__phase-label">Phase 04</span>
            <h3 class="rt-landing__phase-title">
              <a href="#trainer-pll" class="rt-landing__phase-link" @click.prevent="scrollToTrainer('pll')"
                >PLL</a
              >
            </h3>
            <p class="rt-landing__phase-desc">Permute last layer — 21 permutations.</p>
          </article>
        </div>
      </section>

      <div
        class="row g-4 align-items-stretch rt-landing__cfop-notation-row rt-landing-reveal rt-landing-reveal--delay-3"
      >
        <div class="col-12 col-lg-7">
          <section class="rt-landing__cfop rt-landing__cfop--split h-100" aria-labelledby="cfop-heading">
            <h2 id="cfop-heading" class="rt-landing__cfop-title">What is the Fridrich / CFOP method?</h2>
            <p class="rt-landing__cfop-text">
              Popularized by Jessica Fridrich (1997), CFOP remains the dominant speedsolving approach:
              <strong>Cross</strong>,
              <a href="#trainer-f2l" @click.prevent="scrollToTrainer('f2l')">F2L</a>,
              <a href="#trainer-oll" @click.prevent="scrollToTrainer('oll')">OLL</a>, and
              <a href="#trainer-pll" @click.prevent="scrollToTrainer('pll')">PLL</a>.
            </p>
            <p class="rt-landing__cfop-text">
              The last layer needs up to 78 algorithms total — <strong>57 OLL</strong> and
              <strong>21 PLL</strong>. This app focuses on F2L, OLL, and PLL practice.
            </p>
            <h3 class="rt-landing__cfop-subtitle">The four steps</h3>
            <ol class="rt-landing__cfop-list">
              <li><strong>C</strong>ross — bottom cross</li>
              <li><strong>F</strong>2L — first two layers</li>
              <li><strong>O</strong>LL — orient last layer</li>
              <li><strong>P</strong>LL — permute last layer</li>
            </ol>
          </section>
        </div>
        <div class="col-12 col-lg-5">
          <section
            class="rt-landing__panel rt-landing__panel--aside h-100"
            aria-labelledby="notation-heading"
          >
            <div class="rt-landing__panel-inner rt-landing__panel-inner--aside">
              <h2 id="notation-heading" class="rt-landing__panel-title">Notation</h2>
              <p class="rt-landing__panel-text">
                Learn U, D, L, R, F, B and their variations. Tap through moves to see how each turn
                affects a solved cube.
              </p>
              <router-link to="/notation" class="rt-landing__btn-secondary rt-landing__btn-secondary--aside">
                Open notation
              </router-link>
            </div>
          </section>
        </div>
      </div>

      <h2 id="rt-core-trainers" class="rt-landing__section-title rt-landing__trainers-heading rt-landing-reveal">
        Core trainers
      </h2>
      <p class="rt-landing__trainers-sub text-center mb-4 rt-landing-reveal">
        Learn algorithms, track progress, and watch interactive 3D animations.
      </p>

      <div class="row g-4 justify-content-center">
        <div class="col-12 col-lg-4 rt-landing-reveal" id="trainer-f2l">
          <div class="rt-landing__card">
            <h3 class="rt-landing__card-title">F2L trainer</h3>
            <p class="rt-landing__card-desc">41 intuitive &amp; algorithmic cases</p>
            <p class="rt-landing__card-body">
              First two layers — SVG diagrams, filters, learned tracking, custom alg notes, and 3D
              animations. SpeedCubeDB data source.
            </p>
            <ul class="rt-landing__card-list">
              <li>41 F2L cases</li>
              <li>Interactive 3D animations</li>
              <li>Separate progress tracking</li>
            </ul>
            <router-link to="/f2l" class="rt-landing__card-cta rt-landing__card-cta--outline">Open trainer</router-link>
          </div>
        </div>

        <div class="col-12 col-lg-4 rt-landing-reveal rt-landing-reveal--delay-1" id="trainer-oll">
          <div class="rt-landing__card rt-landing__card--elevated">
            <h3 class="rt-landing__card-title">OLL trainer</h3>
            <p class="rt-landing__card-desc">57 top-layer orientations</p>
            <p class="rt-landing__card-body">
              Practice every OLL case — filters, custom algs, focused training mode, and 3D playback.
            </p>
            <ul class="rt-landing__card-list">
              <li>57 OLL cases</li>
              <li>Filter by type or learned</li>
              <li>Custom algorithm editor</li>
            </ul>
            <router-link to="/oll" class="rt-landing__card-cta rt-landing__card-cta--primary">Open trainer</router-link>
          </div>
        </div>

        <div class="col-12 col-lg-4 rt-landing-reveal rt-landing-reveal--delay-2" id="trainer-pll">
          <div class="rt-landing__card">
            <h3 class="rt-landing__card-title">PLL trainer</h3>
            <p class="rt-landing__card-desc">21 edge &amp; corner permutations</p>
            <p class="rt-landing__card-body">
              Drill PLL with the same UX — SVG cases, learned state, custom algs, and animations.
            </p>
            <ul class="rt-landing__card-list">
              <li>21 PLL cases</li>
              <li>Case-type filters</li>
              <li>Progress per case</li>
            </ul>
            <router-link to="/pll" class="rt-landing__card-cta rt-landing__card-cta--tertiary">Open trainer</router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useTheme } from '../composables/useTheme';
import { APP_VERSION } from '../version';

const appVersion = APP_VERSION;

const { isDark, toggleTheme } = useTheme();

function scrollToTrainer(trainer) {
  const element = document.getElementById(`trainer-${trainer}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function scrollToCoreTrainers() {
  const el = document.getElementById('rt-core-trainers');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

let revealObserver;

onMounted(() => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rt-landing-reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  document.querySelectorAll('.rt-landing-reveal').forEach((el) => revealObserver.observe(el));
});

onBeforeUnmount(() => {
  revealObserver?.disconnect();
});
</script>

<style scoped>
.rt-landing {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--rt-color-on-surface);
  background-color: var(--rt-color-surface);
  background-image: var(--rt-gradient-hero);
  transition: background-color var(--rt-transition-medium), color var(--rt-transition-medium);
}

.rt-landing__ambient {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.55;
  background: radial-gradient(ellipse 90% 60% at 10% 20%, rgba(13, 110, 253, 0.15), transparent 50%),
    radial-gradient(ellipse 70% 50% at 90% 80%, rgba(255, 171, 243, 0.08), transparent 45%);
}

html[data-bs-theme='dark'] .rt-landing__ambient,
html.dark-theme .rt-landing__ambient {
  opacity: 0.9;
  background: radial-gradient(ellipse 90% 60% at 10% 20%, rgba(177, 197, 255, 0.14), transparent 50%),
    radial-gradient(ellipse 70% 50% at 90% 80%, rgba(255, 171, 243, 0.06), transparent 45%);
}

.rt-landing__wrap {
  position: relative;
  z-index: 1;
}

.rt-landing__hero {
  text-align: center;
  max-width: 40rem;
  margin: 0 auto 3rem;
}

.rt-landing__eyebrow {
  font-family: var(--rt-font-display);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--rt-color-primary-mid);
  margin-bottom: 1rem;
}

.rt-landing__title {
  font-family: var(--rt-font-display);
  font-weight: 700;
  font-size: clamp(2.5rem, 8vw, 4.25rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  margin: 0 0 1.25rem;
}

.rt-landing__title-line {
  display: block;
}

.rt-landing__title-line--accent {
  background: var(--rt-gradient-primary-btn);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 24px rgba(13, 110, 253, 0.25));
}

html[data-bs-theme='dark'] .rt-landing__title-line--accent,
html.dark-theme .rt-landing__title-line--accent {
  filter: drop-shadow(0 0 28px rgba(177, 197, 255, 0.35));
}

.rt-landing__lead {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--rt-color-on-surface-variant);
  margin: 0 auto 1.75rem;
  max-width: 36rem;
}

.rt-landing__hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.rt-landing__cta-primary {
  font-family: var(--rt-font-display);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.85rem 1.75rem;
  border: none;
  border-radius: var(--rt-radius-lg);
  color: #fff;
  background: var(--rt-gradient-primary-btn);
  box-shadow: var(--rt-shadow-glow-primary);
  cursor: pointer;
  transition: box-shadow var(--rt-transition-fast), filter var(--rt-transition-fast);
}

.rt-landing__cta-primary:hover {
  filter: brightness(1.05);
}

.rt-landing__version {
  font-size: 0.8rem;
  color: var(--rt-color-on-surface-variant);
  font-variant-numeric: tabular-nums;
}

.rt-landing__panel {
  max-width: 44rem;
  margin: 0 auto 3.5rem;
  border-radius: var(--rt-radius-xl);
  background: var(--rt-glass-bg);
  border: 1px solid var(--rt-glass-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--rt-shadow-card);
}

.rt-landing__panel--aside {
  max-width: none;
  margin: 0;
  display: flex;
  flex-direction: column;
}

/* Light: match CFOP block & trainer cards (glass reads as flat white) */
html[data-bs-theme='light'] .rt-landing__panel,
html.light-theme .rt-landing__panel {
  background: var(--rt-color-surface-low);
  border: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: var(--rt-shadow-card);
}

.rt-landing__panel-inner {
  padding: 1.5rem 1.75rem;
}

.rt-landing__panel-inner--aside {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.rt-landing__btn-secondary--aside {
  margin-top: auto;
}

.rt-landing__cfop-notation-row {
  margin-bottom: 2.5rem;
}

.rt-landing__panel-title {
  font-family: var(--rt-font-display);
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.rt-landing__panel-text {
  margin: 0 0 1.25rem;
  color: var(--rt-color-on-surface-variant);
  line-height: 1.55;
}

.rt-landing__btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: var(--rt-radius-lg);
  font-weight: 600;
  text-decoration: none;
  color: var(--rt-color-primary);
  background: var(--rt-color-surface-high);
  border: 1px solid color-mix(in srgb, var(--rt-color-primary) 22%, transparent);
  transition: background var(--rt-transition-fast), border-color var(--rt-transition-fast);
}

.rt-landing__btn-secondary:hover {
  background: var(--rt-color-surface-highest);
  color: var(--rt-color-primary);
}

.rt-landing__methodology {
  margin-bottom: 3rem;
}

.rt-landing__section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.rt-landing__section-title {
  font-family: var(--rt-font-display);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
}

.rt-landing__trainers-heading {
  text-align: center;
  margin-bottom: 0.5rem;
}

.rt-landing__trainers-sub {
  color: var(--rt-color-on-surface-variant);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.rt-landing__link-arrow {
  font-family: var(--rt-font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--rt-color-secondary);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.rt-landing__link-arrow:hover {
  text-decoration: underline;
}

.rt-landing__link-arrow-icon {
  transition: transform var(--rt-transition-fast);
}

.rt-landing__link-arrow:hover .rt-landing__link-arrow-icon {
  transform: translateX(4px);
}

.rt-landing__phases {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .rt-landing__phases {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .rt-landing__phases {
    grid-template-columns: repeat(4, 1fr);
  }
}

.rt-landing__phase {
  padding: 1.25rem 1.35rem;
  border-radius: var(--rt-radius-lg);
  background: var(--rt-color-surface-low);
  transition: box-shadow var(--rt-transition-fast), background var(--rt-transition-fast);
}

.rt-landing__phase:hover {
  box-shadow: var(--rt-shadow-glow-primary);
  background: var(--rt-color-surface-high);
}

.rt-landing__phase-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--rt-color-on-surface-variant);
  margin-bottom: 0.35rem;
}

.rt-landing__phase-title {
  font-family: var(--rt-font-display);
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.rt-landing__phase-link {
  color: inherit;
  text-decoration: none;
}

.rt-landing__phase-link:hover {
  color: var(--rt-color-primary);
}

.rt-landing__phase-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--rt-color-on-surface-variant);
}

.rt-landing__cfop {
  max-width: 44rem;
  margin: 0 auto 2.5rem;
  border-radius: var(--rt-radius-xl);
  background: var(--rt-color-surface-low);
  padding: 1.5rem 1.75rem;
}

.rt-landing__cfop--split {
  max-width: none;
  margin: 0;
}

.rt-landing__cfop-title {
  font-family: var(--rt-font-display);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.rt-landing__cfop-subtitle {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 1.25rem 0 0.5rem;
  color: var(--rt-color-on-surface-variant);
}

.rt-landing__cfop-text {
  margin: 0 0 0.75rem;
  line-height: 1.6;
  color: var(--rt-color-on-surface-variant);
}

.rt-landing__cfop-text:last-of-type {
  margin-bottom: 0;
}

.rt-landing__cfop a {
  color: var(--rt-color-primary-mid);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.rt-landing__cfop a:hover {
  text-decoration: underline;
}

.rt-landing__cfop-list {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--rt-color-on-surface-variant);
  line-height: 1.65;
}

.rt-landing__card {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 1.35rem;
  border-radius: var(--rt-radius-xl);
  background: var(--rt-color-surface-low);
  box-shadow: var(--rt-shadow-card);
  transition: box-shadow var(--rt-transition-fast), background var(--rt-transition-fast);
}

.rt-landing__card:hover {
  box-shadow: var(--rt-shadow-glow-primary);
}

.rt-landing__card--elevated {
  background: var(--rt-color-surface-high);
}

.rt-landing__card-title {
  font-family: var(--rt-font-display);
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 0.25rem;
}

.rt-landing__card-desc {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--rt-color-secondary);
}

.rt-landing__card-body {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--rt-color-on-surface-variant);
  flex-grow: 1;
}

.rt-landing__card-list {
  margin: 0 0 1.25rem;
  padding: 0;
  list-style: none;
  font-size: 0.85rem;
  color: var(--rt-color-on-surface-variant);
}

.rt-landing__card-list li {
  position: relative;
  padding-left: 1.1rem;
  margin-bottom: 0.35rem;
}

.rt-landing__card-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: var(--rt-color-primary-mid);
  box-shadow: 0 0 8px color-mix(in srgb, var(--rt-color-primary) 50%, transparent);
}

.rt-landing__card-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding: 0.7rem 1rem;
  border-radius: var(--rt-radius-lg);
  font-family: var(--rt-font-display);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  transition: filter var(--rt-transition-fast), transform var(--rt-transition-fast);
}

.rt-landing__card-cta:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.rt-landing__card-cta--outline {
  color: var(--rt-color-primary-mid);
  background: var(--rt-color-surface-highest);
  border: 1px solid color-mix(in srgb, var(--rt-color-primary) 28%, transparent);
}

.rt-landing__card-cta--primary {
  color: #fff;
  background: var(--rt-gradient-primary-btn);
  box-shadow: var(--rt-shadow-glow-primary);
}

.rt-landing__card-cta--tertiary {
  color: #1a2200;
  background: linear-gradient(135deg, #e8ff8a 0%, var(--rt-color-tertiary) 100%);
  box-shadow: 0 0 24px color-mix(in srgb, var(--rt-color-tertiary) 30%, transparent);
}

/* Scroll-driven reveal (skipped when reduced motion — script does not observe) */
.rt-landing-reveal {
  opacity: 0;
  transform: translateY(18px);
}

.rt-landing-reveal--visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.65s ease, transform 0.65s ease;
}

.rt-landing-reveal--delay-1.rt-landing-reveal--visible {
  transition-delay: 0.06s;
}

.rt-landing-reveal--delay-2.rt-landing-reveal--visible {
  transition-delay: 0.12s;
}

.rt-landing-reveal--delay-3.rt-landing-reveal--visible {
  transition-delay: 0.18s;
}

@media (prefers-reduced-motion: reduce) {
  .rt-landing-reveal {
    opacity: 1;
    transform: none;
  }

}
</style>
