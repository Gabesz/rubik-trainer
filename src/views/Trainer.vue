<template>
  <div class="app-container" :class="`trainer-${mode}`">
    <header class="fixed-action-bar">
      <div class="container">
        <div
          class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between gap-3"
        >
          <div>
            <div class="d-flex align-items-baseline gap-2 mb-1">
              <h1 class="h3 mb-0">
                {{ modeTitle }} Trainer
              </h1>
              <div class="dropdown" style="margin-top: 0.125rem;">
                <button
                  class="btn btn-sm btn-outline-secondary dropdown-toggle"
                  type="button"
                  :id="`trainerDropdown-${mode}`"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  title="Switch trainer"
                >
                  Switch
                </button>
                <ul class="dropdown-menu" :aria-labelledby="`trainerDropdown-${mode}`">
                  <li>
                    <router-link to="/" class="dropdown-item">
                      <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" class="me-2">
                        <path fill="currentColor" d="M8 0L0 8h2v8h4v-6h4v6h4V8h2z"/>
                      </svg>
                      Home
                    </router-link>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
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
            </div>
            <p class="text-muted">
              Track the algorithms you know and drill them with focused practice sessions.
            </p>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <template v-if="isTraining">
              <button class="btn btn-outline-secondary" type="button" @click="stopTraining">
                Back
              </button>
              <button
                class="btn btn-primary"
                type="button"
                @click="nextTraining"
                :disabled="!currentTraining || learnedCount <= 1"
              >
                New Training
              </button>
            </template>
            <template v-else>
              <button
                class="btn btn-outline-danger"
                type="button"
                @click="confirmResetAlgs"
                :disabled="Object.keys(myAlgsMap).length === 0"
                :class="['position-relative']"
              >
                Reset algs
                <span
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {{ Object.keys(myAlgsMap).length }}
                </span>
              </button>
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="confirmReset"
                :disabled="learnedCount === 0"
              >
                Reset Progress
              </button>
              <button
                class="btn btn-primary position-relative"
                type="button"
                @click="startTraining"
                :disabled="learnedCount === 0"
              >
                Training
                <span
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                >
                  {{ learnedCount }}
                </span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>
    <div class="container">
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
            :learned="isLearned(algorithm.id)"
            :my-alg="getMyAlg(algorithm.id)"
            @toggle="toggleLearned"
            @update-my-alg="setMyAlg"
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
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import AlgorithmCard from '../components/AlgorithmCard.vue';
import TrainingPanel from '../components/TrainingPanel.vue';
import { useLearned } from '../composables/useLearned';

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['oll', 'pll', 'f2l'].includes(value),
  },
});

const modeTitle = computed(() => props.mode.toUpperCase());

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
  pickRandomTraining(true);
  isTraining.value = true;
}

function nextTraining() {
  pickRandomTraining();
}

function stopTraining() {
  isTraining.value = false;
  currentTraining.value = null;
  lastTrainingId.value = null;
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
  if (event.key === 'Escape' && isTraining.value) {
    event.preventDefault();
    stopTraining();
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

onMounted(() => {
  loadAlgorithms();
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('scroll', handleScroll, { passive: true });
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
  showScrollTop.value = false;
  showFilterShortcut.value = false;
  
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

