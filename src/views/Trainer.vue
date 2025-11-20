<template>
  <div class="app-container" :class="`trainer-${mode}`">
    <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light border-bottom">
      <div class="container">
        <!-- Left side: Home icon and title -->
        <div class="d-flex align-items-center gap-2">
          <router-link
            to="/"
            class="home-icon-link"
            title="Home"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
              <path fill="currentColor" d="M8 0L0 8h2v8h4v-6h4v6h4V8h2z"/>
            </svg>
          </router-link>
          <h1 class="h5 mb-0">
            {{ modeTitle }} Trainer
          </h1>
        </div>

        <!-- Right side: Toggler and Dropdown - always visible outside collapse -->
        <div class="d-flex align-items-center gap-2">
          <!-- Dropdown - always visible on mobile -->
          <div class="dropdown d-lg-none">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              :id="`trainerDropdownMobile-${mode}`"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Other trainers
            </a>
            <ul class="dropdown-menu dropdown-menu-end" :aria-labelledby="`trainerDropdownMobile-${mode}`">
              <li>
                <router-link to="/f2l" class="dropdown-item" :class="{ active: mode === 'f2l' }">
                  F2L Trainer
                </router-link>
              </li>
              <li>
                <router-link to="/oll" class="dropdown-item" :class="{ active: mode === 'oll' }">
                  OLL Trainer
                </router-link>
              </li>
              <li>
                <router-link to="/pll" class="dropdown-item" :class="{ active: mode === 'pll' }">
                  PLL Trainer
                </router-link>
              </li>
            </ul>
          </div>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <!-- Collapsible navbar content -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2">
            <template v-if="isTraining">
              <li class="nav-item">
                <a class="nav-link d-flex align-items-center gap-2 d-lg-inline-flex" href="#" @click.prevent="handleNavClick(stopTraining)">
                  <svg class="d-lg-none" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                    <path fill="currentColor" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  <span>Back</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link d-flex align-items-center gap-2 d-lg-inline-flex"
                  href="#"
                  @click.prevent="handleNavClick(nextTraining)"
                  :class="{ disabled: !currentTraining || learnedCount <= 1 }"
                >
                  <svg class="d-lg-none" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                    <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                  </svg>
                  <span>New Training</span>
                </a>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <a
                  class="nav-link text-danger position-relative d-flex align-items-center gap-2 d-lg-inline-flex"
                  href="#"
                  @click.prevent="handleNavClick(confirmResetAlgs)"
                  :class="{ disabled: Object.keys(myAlgsMap).length === 0 }"
                >
                  <svg class="d-lg-none" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                    <path fill="currentColor" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                  </svg>
                  <span>Reset algs</span>
                  <span
                    class="position-absolute badge rounded-pill bg-danger"
                  >
                    {{ Object.keys(myAlgsMap).length }}
                  </span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link d-flex align-items-center gap-2 d-lg-inline-flex"
                  href="#"
                  @click.prevent="handleNavClick(confirmReset)"
                  :class="{ disabled: learnedCount === 0 }"
                >
                  <svg class="d-lg-none" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                    <path fill="currentColor" d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                  </svg>
                  <span>Reset Progress</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link position-relative d-flex align-items-center gap-2 d-lg-inline-flex"
                  href="#"
                  @click.prevent="handleNavClick(startTraining)"
                  :class="{ disabled: learnedCount === 0 }"
                >
                  <svg class="d-lg-none" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                    <path fill="currentColor" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path fill="currentColor" d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.255 1.287-.39 1.287-1.243 0-1.08-.92-1.144-1.416-.165a.75.75 0 0 1-1.25.154z"/>
                  </svg>
                  <span>Training</span>
                  <span
                    class="position-absolute badge rounded-pill bg-success"
                  >
                    {{ learnedCount }}
                  </span>
                </a>
              </li>
            </template>

            <!-- Dropdown - only visible on desktop -->
            <li class="nav-item dropdown d-none d-lg-block">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                :id="`trainerDropdown-${mode}`"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Other trainers
              </a>
              <ul class="dropdown-menu dropdown-menu-end" :aria-labelledby="`trainerDropdown-${mode}`">
                <li>
                  <router-link to="/f2l" class="dropdown-item" :class="{ active: mode === 'f2l' }">
                    F2L Trainer
                  </router-link>
                </li>
                <li>
                  <router-link to="/oll" class="dropdown-item" :class="{ active: mode === 'oll' }">
                    OLL Trainer
                  </router-link>
                </li>
                <li>
                  <router-link to="/pll" class="dropdown-item" :class="{ active: mode === 'pll' }">
                    PLL Trainer
                  </router-link>
                </li>
              </ul>
            </li>
            <!-- Theme toggle and Print buttons - only visible on mobile/tablet -->
            <li class="nav-item d-lg-none">
              <a
                class="nav-link d-flex align-items-center gap-2"
                href="#"
                @click.prevent="handleNavClick(toggleTheme)"
                :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
              >
                <svg v-if="isDark" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                  <path fill="currentColor" d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                </svg>
                <svg v-else aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
                  <path fill="currentColor" d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
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
                  <path fill="currentColor" d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
                  <path fill="currentColor" d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                </svg>
                <span>Print</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container" :class="{ 'training-container': isTraining }">
      <!-- Offcanvas Filters -->
      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        :id="`filterOffcanvas-${mode}`"
        :aria-labelledby="`filterOffcanvasLabel-${mode}`"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" :id="`filterOffcanvasLabel-${mode}`">Filters & Sorting</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <div class="mb-3">
            <div class="badge-filter">
              <button
                type="button"
                class="badge-filter-item list-filter"
                :class="{ active: activeType === null && !activeLearnedOnly }"
                @click="setAllFilter"
                data-bs-dismiss="offcanvas"
              >
                <span class="label">All</span>
                <span class="count">{{ algorithms.length }}</span>
              </button>
              <button
                type="button"
                class="badge-filter-item list-filter"
                :class="{ active: activeLearnedOnly }"
                @click="toggleLearnedFilter"
                data-bs-dismiss="offcanvas"
              >
                <span class="label">Learned</span>
                <span class="count">{{ learnedCount }}</span>
              </button>
              <button
                v-for="type in caseTypes"
                :key="type"
                type="button"
                class="badge-filter-item"
                :class="{ active: activeType === type }"
                @click="setActiveType(type)"
                data-bs-dismiss="offcanvas"
              >
                <span class="label">{{ type }}</span>
                <span class="count">{{ typeCounts[type] ?? 0 }}</span>
              </button>
            </div>
          </div>
          <div>
            <div class="d-flex justify-content-start">
              <div class="btn-group btn-group-sm" role="group" aria-label="Sort algorithms">
                <button
                  type="button"
                  class="btn"
                  :class="sortMode === 'default' ? 'btn-success' : 'btn-outline-secondary'"
                  @click="setSortMode('default')"
                >
                  Default
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="sortMode === 'short' ? 'btn-success' : 'btn-outline-secondary'"
                  @click="setSortMode('short')"
                >
                  Short algs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrainingPanel
        v-if="isTraining"
        class="training-only"
        :algorithm="currentTraining"
        :learned-count="learnedCount"
        :my-alg="currentTraining ? getMyAlg(currentTraining.id) : ''"
        :should-blur="shouldBlurStandardAlg"
        @new="nextTraining"
        @back="stopTraining"
      />

      <section v-else-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <p class="mt-3 text-muted">Loading algorithms…</p>
      </section>

      <section v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </section>

      <section v-else>
        <div class="badge-filter mb-3">
          <button
            type="button"
            class="badge-filter-item list-filter"
            :class="{ active: activeType === null && !activeLearnedOnly }"
            @click="setAllFilter"
          >
            <span class="label">All</span>
            <span class="count">{{ algorithms.length }}</span>
          </button>
          <button
            type="button"
            class="badge-filter-item list-filter"
            :class="{ active: activeLearnedOnly }"
            @click="toggleLearnedFilter"
          >
            <span class="label">Learned</span>
            <span class="count">{{ learnedCount }}</span>
          </button>
          <button
            v-for="type in caseTypes"
            :key="type"
            type="button"
            class="badge-filter-item"
            :class="{ active: activeType === type }"
            @click="setActiveType(type)"
          >
            <span class="label">{{ type }}</span>
            <span class="count">{{ typeCounts[type] ?? 0 }}</span>
          </button>
        </div>
        <div class="d-flex justify-content-end mb-4" ref="sortControlsRef">
          <div class="btn-group btn-group-sm" role="group" aria-label="Sort algorithms">
            <button
              type="button"
              class="btn"
              :class="sortMode === 'default' ? 'btn-success' : 'btn-outline-secondary'"
              @click="setSortMode('default')"
              title="Original order"
            >
              Default
            </button>
            <button
              type="button"
              class="btn"
              :class="sortMode === 'short' ? 'btn-success' : 'btn-outline-secondary'"
              @click="setSortMode('short')"
              title="Shortest standard algorithms first"
            >
              Short algs
            </button>
          </div>
        </div>

        <div class="algorithm-grid pb-5">
          <AlgorithmCard
            v-for="algorithm in visibleAlgorithms"
            :key="algorithm.id"
            :algorithm="algorithm"
            :mode="mode"
            :learned="isLearned(algorithm.id)"
            :my-alg="getMyAlg(algorithm.id)"
            @toggle="toggleLearned"
            @update-my-alg="setMyAlg"
            @filter-by-type="setActiveType"
            class="algorithm-grid-item"
          />
        </div>
      </section>
    </div>
    <button
      v-if="showScrollTop"
      type="button"
      class="btn btn-primary scroll-top-btn"
      @click="scrollToTop"
      aria-label="Scroll to top"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16">
        <path
          fill="currentColor"
          d="M3.204 9.5 8 4.707 12.796 9.5 12 10.293 8.5 6.793V13.5h-1V6.793L4 10.293z"
        />
      </svg>
    </button>
    <button
      v-if="showFilterShortcut && !isTraining"
      type="button"
      class="btn btn-secondary filter-fab"
      :data-bs-toggle="'offcanvas'"
      :data-bs-target="`#filterOffcanvas-${mode}`"
      :aria-controls="`filterOffcanvas-${mode}`"
      title="Show filters"
      aria-label="Show filters"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
        <path fill="currentColor" d="M6 10.5V15l4-2v-2.5l4.854-4.854A.5.5 0 0 0 14.5 4h-13a.5.5 0 0 0-.354.854z"/>
      </svg>
    </button>
    <!-- Floating action buttons group - only visible on desktop -->
    <div class="floating-action-group d-none d-lg-flex">
      <button
        type="button"
        class="btn btn-primary floating-action-btn"
        @click="toggleTheme"
        :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        aria-label="Toggle theme"
      >
        <svg v-if="isDark" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
          <path fill="currentColor" d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
        </svg>
        <svg v-else aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
          <path fill="currentColor" d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        </svg>
      </button>
      <button
        type="button"
        class="btn btn-primary floating-action-btn"
        @click="handlePrint"
        title="Print"
        aria-label="Print"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
          <path fill="currentColor" d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
          <path fill="currentColor" d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AlgorithmCard from '../components/AlgorithmCard.vue';
import TrainingPanel from '../components/TrainingPanel.vue';
import { useLearned } from '../composables/useLearned';
import { useTheme } from '../composables/useTheme';

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['oll', 'pll', 'f2l'].includes(value),
  },
  algorithmId: {
    type: String,
    default: null,
  },
});

const router = useRouter();
const route = useRoute();

const modeTitle = computed(() => props.mode.toUpperCase());

const { isDark, toggleTheme } = useTheme();

// Function to get fetchAlgorithms based on mode
async function getFetchAlgorithms() {
  if (props.mode === 'oll') {
    const ollModule = await import('../data/oll.js');
    return ollModule.fetchAlgorithms;
  } else if (props.mode === 'pll') {
    const pllModule = await import('../data/pll.js');
    return pllModule.fetchAlgorithms;
  } else {
    const f2lModule = await import('../data/f2l.js');
    return f2lModule.fetchAlgorithms;
  }
}

const algorithms = ref([]);
const loading = ref(true);
const error = ref('');
const isTraining = ref(false);
const currentTraining = ref(null);
const shouldBlurStandardAlg = ref(false);
const activeType = ref(null);
const activeLearnedOnly = ref(false);
const lastTrainingId = ref(null);
const showScrollTop = ref(false);
const sortMode = ref('default');
const showFilterShortcut = ref(false);
const sortControlsRef = ref(null);
let sortObserver = null;

const STORAGE_KEYS = computed(() => ({
  filterType: `${props.mode}.filter.type`,
  learnedOnly: `${props.mode}.filter.learnedOnly`,
  sortMode: `${props.mode}.sort.mode`,
}));

const {
  learnedIds,
  learnedCount,
  getMyAlg,
  setMyAlg: setMyAlgEntry,
  resetMyAlgs,
  toggleLearned: toggleLearnedEntry,
  resetLearned: resetLearnedEntry,
  isLearned,
  reloadFromStorage,
} = useLearned(props.mode);

function setMyAlg(id, value) {
  setMyAlgEntry(id, value, props.mode);
}

const myAlgsMap = computed(() => {
  const map = {};
  for (const alg of algorithms.value) {
    const v = getMyAlg(alg.id);
    if (v !== undefined && v !== null && v !== '') {
      map[alg.id] = v;
    }
  }
  return map;
});

const learnedAlgorithms = computed(() =>
  algorithms.value.filter((algorithm) => learnedIds.value.includes(algorithm.id)),
);

const caseTypes = computed(() => {
  const types = new Set(algorithms.value.map((algorithm) => algorithm.type));
  return Array.from(types).sort((a, b) => a.localeCompare(b));
});

const typeCounts = computed(() =>
  algorithms.value.reduce((acc, algorithm) => {
    acc[algorithm.type] = (acc[algorithm.type] ?? 0) + 1;
    return acc;
  }, {}),
);

const filteredAlgorithms = computed(() => {
  let list = activeType.value
    ? algorithms.value.filter((algorithm) => algorithm.type === activeType.value)
    : algorithms.value;
  if (activeLearnedOnly.value) {
    const learnedSet = new Set(learnedIds.value);
    list = list.filter((algorithm) => learnedSet.has(algorithm.id));
  }
  return list;
});

const visibleAlgorithms = computed(() => {
  if (sortMode.value !== 'short') {
    return filteredAlgorithms.value;
  }
  const score = (alg) => {
    const s = (alg.standardAlg || '').replace(/\s+/g, '');
    return s.length === 0 ? Number.POSITIVE_INFINITY : s.length;
  };
  return [...filteredAlgorithms.value].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name);
  });
});

function pickRandomTraining(force = false) {
  const pool = learnedAlgorithms.value;
  if (pool.length === 0) {
    currentTraining.value = null;
    lastTrainingId.value = null;
    return;
  }
  if (pool.length === 1) {
    currentTraining.value = pool[0];
    lastTrainingId.value = pool[0].id;
    return;
  }
  let candidate;
  do {
    const randomIndex = Math.floor(Math.random() * pool.length);
    candidate = pool[randomIndex];
  } while (!force && candidate.id === lastTrainingId.value);
  currentTraining.value = candidate;
  lastTrainingId.value = candidate.id;
}

async function loadAlgorithms() {
  loading.value = true;
  error.value = '';
  try {
    const fetchAlgorithms = await getFetchAlgorithms();
    algorithms.value = await fetchAlgorithms();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load algorithms.';
  } finally {
    loading.value = false;
    requestAnimationFrame(() => {
      if (!isTraining.value && sortControlsRef.value) {
        const rect = sortControlsRef.value.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        const inView = rect.top >= 0 && rect.top <= viewportH;
        showFilterShortcut.value = !inView;
      }
      const allTypes = new Set(caseTypes.value);
      if (activeType.value && !allTypes.has(activeType.value)) {
        activeType.value = null;
      }
    });
    
  }
}

function startTraining() {
  if (learnedCount.value === 0) {
    return;
  }
  shouldBlurStandardAlg.value = true;
  pickRandomTraining(true);
  isTraining.value = true;
  // Update URL with algorithm ID
  if (currentTraining.value) {
    previousAlgorithmId = currentTraining.value.id;
    router.push({ 
      path: `/${props.mode}/${currentTraining.value.id}` 
    });
  }
}

function nextTraining() {
  shouldBlurStandardAlg.value = true; // Enable blur for new training
  pickRandomTraining();
  // Update URL with new algorithm ID
  if (currentTraining.value) {
    previousAlgorithmId = currentTraining.value.id;
    router.push({ 
      path: `/${props.mode}/${currentTraining.value.id}` 
    });
  }
}

function stopTraining() {
  isTraining.value = false;
  currentTraining.value = null;
  lastTrainingId.value = null;
  shouldBlurStandardAlg.value = false;
  // Remove algorithm ID from URL
  router.push({ 
    path: `/${props.mode}` 
  });
}

function toggleLearned(id) {
  toggleLearnedEntry(id, props.mode);
  if (isTraining.value && learnedAlgorithms.value.length === 0) {
    stopTraining();
  } else if (isTraining.value && currentTraining.value) {
    const stillLearned = learnedAlgorithms.value.some(
      (algorithm) => algorithm.id === currentTraining.value?.id,
    );
    if (!stillLearned) {
      pickRandomTraining();
    }
  }
}

function handleReset() {
  resetLearnedEntry(props.mode);
  stopTraining();
}

function setActiveType(type) {
  if (activeLearnedOnly.value) {
    activeLearnedOnly.value = false;
  }
  activeType.value = type;
}

function toggleLearnedFilter() {
  activeLearnedOnly.value = !activeLearnedOnly.value;
  if (activeLearnedOnly.value) {
    activeType.value = null;
  }
}

function setAllFilter() {
  activeLearnedOnly.value = false;
  activeType.value = null;
}

function confirmReset() {
  if (
    learnedCount.value === 0 ||
    window.confirm('Are you sure you want to clear all learned algorithms?')
  ) {
    handleReset();
  }
}

function confirmResetAlgs() {
  const hasAny = Object.keys(myAlgsMap.value).length > 0;
  if (!hasAny) return;
  if (window.confirm('Reset all edited algorithms back to their defaults?')) {
    resetMyAlgs(props.mode);
  }
}

function setSortMode(mode) {
  sortMode.value = mode;
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    // Close hamburger menu if open (mobile/tablet)
    if (window.innerWidth < 992) {
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        event.preventDefault();
        closeNavbar();
        return;
      }
    }
    // Exit training mode if in training
    if (isTraining.value) {
      event.preventDefault();
      stopTraining();
    }
  }
}

function handleScroll() {
  showScrollTop.value = window.scrollY > 160;
  if (!isTraining.value && sortControlsRef.value) {
    const rect = sortControlsRef.value.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const inView = rect.top >= 0 && rect.top <= viewportH;
    showFilterShortcut.value = !inView;
  } else {
    showFilterShortcut.value = false;
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeNavbar() {
  // Close Bootstrap collapse navbar on mobile
  const navbarCollapse = document.getElementById('navbarNav');
  const navbarToggler = document.querySelector('[data-bs-target="#navbarNav"]');
  if (navbarCollapse && navbarToggler) {
    // Check if collapse is currently shown
    if (navbarCollapse.classList.contains('show')) {
      // Use Bootstrap's Collapse API if available
      if (window.bootstrap && window.bootstrap.Collapse) {
        const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          // Fallback: manually remove show class and update aria attributes
          navbarCollapse.classList.remove('show');
          navbarToggler.setAttribute('aria-expanded', 'false');
        }
      } else {
        // Fallback: manually remove show class and update aria attributes
        navbarCollapse.classList.remove('show');
        navbarToggler.setAttribute('aria-expanded', 'false');
      }
    }
  }
}

function handleNavClick(callback) {
  callback();
  closeNavbar();
}

function handlePrint() {
  window.print();
}

function handleContentClick(event) {
  // Only close navbar on mobile/tablet (when navbar is collapsed)
  if (window.innerWidth < 992) {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      // Check if click is outside navbar
      const navbar = document.querySelector('.navbar');
      if (navbar && !navbar.contains(event.target)) {
        closeNavbar();
      }
    }
  }
}

onMounted(() => {
  loadAlgorithms();
  
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('click', handleContentClick);
  handleScroll();
  

  try {
    const savedType = localStorage.getItem(STORAGE_KEYS.value.filterType);
    const savedLearnedOnly = localStorage.getItem(STORAGE_KEYS.value.learnedOnly);
    const savedSort = localStorage.getItem(STORAGE_KEYS.value.sortMode);
    if (savedSort === 'default' || savedSort === 'short') {
      sortMode.value = savedSort;
    }
    if (savedLearnedOnly === 'true') {
      activeLearnedOnly.value = true;
      activeType.value = null;
    } else if (savedType && savedType !== 'null') {
      activeType.value = savedType;
      activeLearnedOnly.value = false;
    }
  } catch {}

  if ('IntersectionObserver' in window) {
    sortObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          showFilterShortcut.value = !entry.isIntersecting && !isTraining.value;
        }
      },
      { root: null, threshold: 0 }
    );
    if (sortControlsRef.value) {
      sortObserver.observe(sortControlsRef.value);
    }
  }
  
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('click', handleContentClick);
  if (sortObserver && sortControlsRef.value) {
    try {
      sortObserver.unobserve(sortControlsRef.value);
      sortObserver.disconnect();
    } catch {}
    sortObserver = null;
  }
});

watch(isTraining, (val) => {
  if (val) {
    showFilterShortcut.value = false;
  } else if (sortControlsRef.value && sortObserver) {
    requestAnimationFrame(() => {
      const rect = sortControlsRef.value.getBoundingClientRect();
      const inView = rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
      showFilterShortcut.value = !inView;
    });
  }
});

// Track previous algorithmId to detect refresh
let previousAlgorithmId = null;

// Watch for algorithmId parameter in URL (e.g., on refresh or direct navigation)
watch(() => [route.params.algorithmId, algorithms.value.length], ([algorithmId, algLength], oldValue) => {
  // Wait for algorithms to load before processing
  if (algLength === 0) {
    return;
  }
  
  if (algorithmId && learnedCount.value > 0) {
    // On refresh (same algorithmId as before), always generate new random element
    // Keep blur state - if it was true (from Training button), keep it true
    if (algorithmId === previousAlgorithmId && previousAlgorithmId !== null) {
      pickRandomTraining(true);
      isTraining.value = true;
      if (currentTraining.value) {
        router.replace({ 
          path: `/${props.mode}/${currentTraining.value.id}` 
        });
      }
      previousAlgorithmId = currentTraining.value?.id || null;
      return;
    }
    
    // Find algorithm by ID
    const algorithm = algorithms.value.find(alg => alg.id === algorithmId);
    
    if (algorithm && learnedIds.value.includes(algorithm.id)) {
      // Algorithm found and is learned, set it as current training
      shouldBlurStandardAlg.value = false; // No blur when coming from list view
      currentTraining.value = algorithm;
      lastTrainingId.value = algorithm.id;
      isTraining.value = true;
      previousAlgorithmId = algorithm.id;
    } else if (algorithm && !learnedIds.value.includes(algorithm.id)) {
      // Algorithm found but not learned, generate new random
      shouldBlurStandardAlg.value = false; // No blur when coming from list view
      pickRandomTraining(true);
      isTraining.value = true;
      if (currentTraining.value) {
        router.replace({ 
          path: `/${props.mode}/${currentTraining.value.id}` 
        });
      }
      previousAlgorithmId = currentTraining.value?.id || null;
    } else {
      // Algorithm not found, generate new random
      shouldBlurStandardAlg.value = false; // No blur when coming from list view
      pickRandomTraining(true);
      isTraining.value = true;
      if (currentTraining.value) {
        router.replace({ 
          path: `/${props.mode}/${currentTraining.value.id}` 
        });
      }
      previousAlgorithmId = currentTraining.value?.id || null;
    }
  } else if (algorithmId && learnedCount.value === 0) {
    // Algorithm ID exists but no learned items, remove it
    router.replace({ path: `/${props.mode}` });
    previousAlgorithmId = null;
  } else if (!algorithmId && isTraining.value) {
    // Algorithm ID removed, exit training mode
    stopTraining();
    previousAlgorithmId = null;
  }
}, { immediate: true });

watch(sortMode, (val) => {
  try {
    localStorage.setItem(STORAGE_KEYS.value.sortMode, val);
  } catch {}
});

watch(activeLearnedOnly, (val) => {
  try {
    localStorage.setItem(STORAGE_KEYS.value.learnedOnly, String(val));
    if (val) {
      activeType.value = null;
      localStorage.setItem(STORAGE_KEYS.value.filterType, 'null');
    }
  } catch {}
});

watch(activeType, (val) => {
  try {
    localStorage.setItem(STORAGE_KEYS.value.filterType, val == null ? 'null' : String(val));
    if (val != null) {
      activeLearnedOnly.value = false;
      localStorage.setItem(STORAGE_KEYS.value.learnedOnly, 'false');
    }
  } catch {}
});

// Watch for mode changes and reload algorithms
watch(() => props.mode, (newMode) => {
  // Reset training state when switching trainers (but keep filters)
  isTraining.value = false;
  currentTraining.value = null;
  lastTrainingId.value = null;
  shouldBlurStandardAlg.value = false;
  showScrollTop.value = false;
  showFilterShortcut.value = false;
  previousAlgorithmId = null;
  
  // Reload learned data for the new mode
  reloadFromStorage(newMode);
  
  // Reload algorithms for the new mode
  loadAlgorithms();
  
  // Reload filter/sort state from localStorage for the new mode
  // STORAGE_KEYS is now computed, so it will automatically use the new mode
  try {
    const savedType = localStorage.getItem(STORAGE_KEYS.value.filterType);
    const savedLearnedOnly = localStorage.getItem(STORAGE_KEYS.value.learnedOnly);
    const savedSort = localStorage.getItem(STORAGE_KEYS.value.sortMode);
    if (savedSort === 'default' || savedSort === 'short') {
      sortMode.value = savedSort;
    } else {
      sortMode.value = 'default';
    }
    if (savedLearnedOnly === 'true') {
      activeLearnedOnly.value = true;
      activeType.value = null;
    } else if (savedType && savedType !== 'null') {
      activeType.value = savedType;
      activeLearnedOnly.value = false;
    } else {
      // No saved filters, reset to default
      activeType.value = null;
      activeLearnedOnly.value = false;
    }
  } catch {
    // On error, reset to default
    sortMode.value = 'default';
    activeType.value = null;
    activeLearnedOnly.value = false;
  }
  
  // Scroll to top when switching trainers
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
.home-icon-link {
  display: inline-flex;
  align-items: center;
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
  line-height: 1;
  padding: 0.25rem;
  margin-right: 0.5rem;
}

.home-icon-link:hover {
  color: #0d6efd;
  transform: translateY(-1px);
}

.home-icon-link:focus-visible {
  outline: 2px solid rgba(13, 110, 253, 0.4);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.app-container {
  padding-top: 4.5rem;
}

/* Training mode: center content vertically */
.training-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4.5rem);
  padding-left: calc(var(--bs-gutter-x, 1.5rem) - 10px);
  padding-right: calc(var(--bs-gutter-x, 1.5rem) - 10px);
}

.nav-link.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

/* Badge positioning for desktop */
.nav-link.position-relative {
  padding-right: 1.5rem !important;
}

.nav-link.position-relative .badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  font-size: 0.65rem;
  padding: 0.15rem 0.4rem;
  min-width: 1.25rem;
  text-align: center;
}

/* Mobile navbar fixes */
@media (max-width: 991.98px) {
  .navbar-nav {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .navbar-nav .nav-item {
    margin-bottom: 0.25rem;
  }
  
  .navbar-nav .nav-link {
    padding: 0.5rem 0.75rem;
  }
  
  /* Badge positioning fix for mobile */
  .nav-link.position-relative .badge {
    position: absolute;
    top: -0.25rem;
    right: -0.5rem;
    font-size: 0.65rem;
    padding: 0.15rem 0.35rem;
  }
  
  /* Ensure dropdown doesn't overflow */
  .dropdown-menu {
    max-width: 100%;
  }
  
  /* Dropdown outside collapse styling */
  .navbar .dropdown .nav-link {
    padding: 0.5rem 0.75rem;
    color: #6c757d;
  }
  
  .navbar .dropdown .nav-link:hover {
    color: #0d6efd;
  }
  
}
</style>

