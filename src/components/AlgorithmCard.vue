<template>
  <div
    class="card algorithm-card"
    :class="[$attrs.class, { learned }, { practicing: practicing && !learned }, { 'algorithm-card--library': libraryLayout }]"
    :data-algorithm-id="algorithm.id"
  >
    <div class="card-body d-flex flex-column">
      <template v-if="libraryLayout">
        <div class="rt-lib-card__top">
          <span v-if="paddedCaseIndex" class="rt-lib-card__case">Case {{ paddedCaseIndex }}</span>
          <div
            class="rt-lib-card__status"
            :class="{
              'rt-lib-card__status--on': learned,
              'rt-lib-card__status--practice': practicing && !learned,
            }"
          >
            <svg
              v-if="learned"
              class="rt-lib-card__status-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
            <svg
              v-else-if="practicing"
              class="rt-lib-card__status-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
              />
            </svg>
            <svg
              v-else
              class="rt-lib-card__status-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
              />
            </svg>
            <span class="rt-lib-card__status-text">{{ libraryStatusLabel }}</span>
          </div>
          <button
            type="button"
            class="btn btn-primary btn-sm rt-lib-card__play d-flex align-items-center gap-1"
            data-bs-toggle="modal"
            :data-bs-target="`#cubeModal-${algorithm.id}`"
            title="Play 3D animation"
            @click.stop
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
              />
            </svg>
            <span>Play</span>
          </button>
        </div>

        <h4 class="rt-lib-card__title mb-0">
          <template v-if="nameEditing">
            <input
              type="text"
              class="form-control form-control-sm algorithm-name-edit"
              v-model="localName"
              @blur="commitNameEdit"
              @keydown.enter="commitNameEdit"
              @keydown.escape="cancelNameEdit"
              ref="nameInputRef"
            />
          </template>
          <span
            v-else
            class="rt-lib-card__title-text algorithm-name-link"
            role="button"
            tabindex="0"
            title="Click to edit name"
            @click="handleNameClick"
            @keydown.enter="handleNameClick"
            @keydown.space.prevent="handleNameClick"
          >
            {{ displayName }}
          </span>
        </h4>

        <div class="text-center my-3 algorithm-image-container">
          <router-link :to="`/${mode}/${algorithm.id}`" class="d-inline-block">
            <img
              :src="algorithm.imageUrl"
              :alt="`Diagram for ${algorithm.name}`"
              class="img-fluid"
              loading="lazy"
            />
          </router-link>
        </div>

        <p class="rt-lib-card__setup small mb-2">
          <span class="rt-lib-card__k">Setup</span>
          <span class="font-monospace d-block mt-1">{{ algorithm.setup }}</span>
        </p>

        <div :class="['rt-lib-card__alg', editing ? 'mb-2' : 'mb-2']">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="rt-lib-card__alg-label">Algorithm</span>
            <button
              type="button"
              class="btn btn-link p-0 text-decoration-none edit-hint"
              @click.stop="handleEditButton"
            >
              <template v-if="editing">
                <span class="text-primary">Save</span>
              </template>
              <template v-else-if="showSavedIndicator">
                <span class="text-success d-inline-flex align-items-center gap-1">
                  <svg class="check-icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm3.354-8.646-.708-.708L7.5 8.793 5.854 7.146l-.708.708L7.5 10.207l3.854-3.853z"
                    />
                  </svg>
                  Saved
                </span>
              </template>
              <template v-else>
                <span class="text-muted">Edit</span>
              </template>
            </button>
          </div>
          <div class="rt-lib-card__alg-plate my-alg-field">
            <textarea
              v-if="editing"
              class="form-control form-control-sm font-monospace"
              rows="2"
              v-model="localAlg"
              @blur="commitEdit"
              ref="textareaRef"
            ></textarea>
            <div v-else class="my-alg-display font-monospace" role="button" @click.stop="activateEditing">
              <span v-if="localAlg" class="fw-bold" v-html="formattedAlg"></span>
              <span v-else class="placeholder">Tap to add your alg</span>
            </div>
          </div>
        </div>

        <div class="mt-3" v-if="showToggle">
          <template v-if="learned">
            <button
              type="button"
              class="btn w-100 d-flex align-items-center justify-content-center gap-2 btn-success"
              @click="$emit('toggle-learned', algorithm.id)"
            >
              <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                />
              </svg>
              <span>Learned</span>
            </button>
          </template>
          <div v-else class="d-flex gap-2 w-100 align-items-stretch algorithm-card__twin-actions">
            <button
              type="button"
              class="btn flex-fill min-w-0 d-flex align-items-center justify-content-center gap-1 px-2"
              :class="practicing ? 'btn-warning' : 'btn-outline-warning'"
              :title="practicing ? 'Remove from practice list' : ''"
              @click="$emit('toggle-practice', algorithm.id)"
            >
              <svg class="practice-icon flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
              </svg>
              <span class="text-truncate min-w-0">{{ practicing ? 'Practicing' : 'Mark as practicing' }}</span>
            </button>
            <button
              type="button"
              class="btn flex-fill min-w-0 d-flex align-items-center justify-content-center gap-1 px-2 btn-outline-success"
              @click="$emit('toggle-learned', algorithm.id)"
            >
              <svg class="heart-icon flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z"
                />
              </svg>
              <span class="text-truncate min-w-0">Mark as learned</span>
            </button>
          </div>
        </div>
      </template>

      <template v-else>
      <div class="text-center mb-3 algorithm-image-container">
        <router-link :to="`/${mode}/${algorithm.id}`" class="d-inline-block">
          <img
            :src="algorithm.imageUrl"
            :alt="`Diagram for ${algorithm.name}`"
            class="img-fluid"
            loading="lazy"
          />
        </router-link>
      </div>
      <div class="d-flex justify-content-between align-items-start algorithm-title-container">
        <div class="d-flex align-items-center gap-2 flex-grow-1">
          <h5 class="card-title mb-0">
            <template v-if="nameEditing">
              <input
                type="text"
                class="form-control form-control-sm d-inline-block algorithm-name-edit"
                v-model="localName"
                @blur="commitNameEdit"
                @keydown.enter="commitNameEdit"
                @keydown.escape="cancelNameEdit"
                ref="nameInputRef"
              />
            </template>
            <span
              v-else
              class="text-decoration-none algorithm-name-link"
              role="button"
              tabindex="0"
              @click="handleNameClick"
              @keydown.enter="handleNameClick"
              @keydown.space.prevent="handleNameClick"
              title="Click to edit name"
            >
              {{ displayName }}
            </span>
          </h5>
          <button
            type="button"
            class="btn btn-primary btn-sm d-flex align-items-center gap-1"
            data-bs-toggle="modal"
            :data-bs-target="`#cubeModal-${algorithm.id}`"
            title="Play 3D animation"
            @click.stop
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
            </svg>
            <span>Play</span>
          </button>
        </div>
        <span 
          class="badge bg-secondary case-type-badge" 
          role="button"
          @click.stop="$emit('filter-by-type', algorithm.type)"
          style="cursor: pointer;"
          :title="`Filter by ${algorithm.type}`"
        >{{ algorithm.type }}</span>
      </div>
      <p class="mb-2 small">
        <strong>Setup:</strong>
        <span class="font-monospace d-block">{{ algorithm.setup }}</span>
      </p>
      <div :class="['small', editing ? 'mb-3' : 'mb-1']">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <label class="form-label mb-0"><strong>Alg:</strong></label>
          <button
            type="button"
            class="btn btn-link p-0 text-decoration-none edit-hint"
            @click.stop="handleEditButton"
          >
            <template v-if="editing">
              <span class="text-primary">Save</span>
            </template>
            <template v-else-if="showSavedIndicator">
              <span class="text-success d-inline-flex align-items-center gap-1">
                <svg class="check-icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm3.354-8.646-.708-.708L7.5 8.793 5.854 7.146l-.708.708L7.5 10.207l3.854-3.853z"
                  />
                </svg>
                Saved
              </span>
            </template>
            <template v-else>
              <span class="text-muted">Click to edit</span>
            </template>
          </button>
        </div>
        <div class="my-alg-field">
          <textarea
            v-if="editing"
            class="form-control form-control-sm font-monospace"
            rows="2"
            v-model="localAlg"
            @blur="commitEdit"
            ref="textareaRef"
          ></textarea>
          <div v-else class="my-alg-display font-monospace" role="button" @click.stop="activateEditing">
            <span v-if="localAlg" class="fw-bold" v-html="formattedAlg"></span>
            <span v-else class="placeholder">Click to add your version</span>
          </div>
        </div>
      </div>
      <div class="mt-auto" v-if="showToggle">
        <template v-if="learned">
          <button
            type="button"
            class="btn w-100 d-flex align-items-center justify-content-center gap-2 btn-success"
            @click="$emit('toggle-learned', algorithm.id)"
          >
            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
              />
            </svg>
            <span>Learned</span>
          </button>
        </template>
        <div v-else class="d-flex gap-2 w-100 align-items-stretch algorithm-card__twin-actions">
          <button
            type="button"
            class="btn flex-fill min-w-0 d-flex align-items-center justify-content-center gap-1 px-2"
            :class="practicing ? 'btn-warning' : 'btn-outline-warning'"
            :title="practicing ? 'Remove from practice list' : ''"
            @click="$emit('toggle-practice', algorithm.id)"
          >
            <svg class="practice-icon flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
            </svg>
            <span class="text-truncate min-w-0">{{ practicing ? 'Practicing' : 'Mark as practicing' }}</span>
          </button>
          <button
            type="button"
            class="btn flex-fill min-w-0 d-flex align-items-center justify-content-center gap-1 px-2 btn-outline-success"
            @click="$emit('toggle-learned', algorithm.id)"
          >
            <svg class="heart-icon flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z"
              />
            </svg>
            <span class="text-truncate min-w-0">Mark as learned</span>
          </button>
        </div>
      </div>
      </template>
    </div>
  </div>

  <!-- 3D Cube Animation Modal (twisty only mounts when open — avoids init in display:none + many list cards) -->
  <div
    ref="cubeModalRef"
    class="modal fade"
    :id="`cubeModal-${algorithm.id}`"
    tabindex="-1"
    aria-labelledby="cubeModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="d-flex align-items-center gap-2">
            <strong v-if="!displayName.toUpperCase().startsWith(mode.toUpperCase())">{{ mode.toUpperCase() }}</strong>
            <strong class="modal-title mb-0" id="cubeModalLabel">{{ displayName }}</strong>
            <span v-if="algorithm.type">({{ algorithm.type }})</span>
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <RubikCube3D
            v-if="showRubikCube"
            :algorithm="algorithm.standardAlg || localAlg"
            :setup="algorithm.setup"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount, onMounted, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import RubikCube3D from './RubikCube3D.vue';

defineOptions({ inheritAttrs: false });

const router = useRouter();

const props = defineProps({
  algorithm: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    required: true,
    validator: (value) => ['oll', 'pll', 'f2l'].includes(value),
  },
  learned: {
    type: Boolean,
    default: false,
  },
  practicing: {
    type: Boolean,
    default: false,
  },
  showToggle: {
    type: Boolean,
    default: true,
  },
  libraryLayout: {
    type: Boolean,
    default: false,
  },
  caseIndex: {
    type: Number,
    default: null,
  },
  myAlg: {
    type: String,
    default: '',
  },
  myName: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['toggle-learned', 'toggle-practice', 'update-my-alg', 'update-my-name', 'filter-by-type']);

const libraryStatusLabel = computed(() => {
  if (props.learned) return 'Learned';
  if (props.practicing) return 'Practicing';
  return 'In progress';
});

const displayName = computed(() => {
  const custom = props.myName;
  if (custom !== undefined && custom !== null && String(custom).trim() !== '') {
    return String(custom).trim();
  }
  return props.algorithm.name;
});

const paddedCaseIndex = computed(() => {
  if (props.caseIndex == null || props.caseIndex < 1) {
    return '';
  }
  return String(props.caseIndex).padStart(2, '0');
});

const localAlg = ref(props.myAlg || props.algorithm.standardAlg);
const localName = ref(
  (props.myName && String(props.myName).trim()) || props.algorithm.name
);
const nameEditing = ref(false);
const nameInputRef = ref(null);
const editing = ref(false);
const textareaRef = ref(null);
const showSavedIndicator = ref(false);
const cubeModalRef = ref(null);
/** Mount twisty only after modal is visible (Bootstrap shown.bs.modal). */
const showRubikCube = ref(false);
let savedTimer = null;

function onCubeModalShown() {
  showRubikCube.value = true;
}

function onCubeModalHidden() {
  showRubikCube.value = false;
}

const standardAlg = computed(() => props.algorithm.standardAlg || '');

const formattedAlg = computed(() => {
  const text = localAlg.value || '';
  return text
    .replace(/\)/g, ')<wbr>')
    .replace(/\s+/g, '&nbsp;');
});

watch(
  () => props.myAlg,
  (newValue) => {
    const fallback = props.algorithm.standardAlg;
    const incoming = newValue ?? '';
    if (incoming !== undefined && incoming !== localAlg.value) {
      localAlg.value = incoming || fallback;
    }
  },
);

watch(localAlg, (value, oldValue) => {
  if (value === oldValue) {
    return;
  }
  const fallback = props.algorithm.standardAlg;
  emit('update-my-alg', props.algorithm.id, value || fallback);
});

watch(displayName, (val) => {
  if (!nameEditing.value) {
    localName.value = val;
  }
});

function handleNameClick() {
  nameEditing.value = true;
  localName.value = displayName.value;
  nextTick(() => nameInputRef.value?.focus());
}

function commitNameEdit() {
  nameEditing.value = false;
  const trimmed = (localName.value || '').trim();
  const defaultName = props.algorithm.name;
  if (trimmed === '' || trimmed === defaultName) {
    emit('update-my-name', props.algorithm.id, '');
  } else {
    emit('update-my-name', props.algorithm.id, trimmed);
  }
}

function cancelNameEdit() {
  nameEditing.value = false;
  localName.value = displayName.value;
}

// Watch for algorithm changes and re-initialize router-links
watch(() => props.algorithm.id, () => {
  nextTick(() => {
    const initRouterLinks = () => {
      const cardElement = document.querySelector(`.algorithm-card[data-algorithm-id="${props.algorithm.id}"]`);
      if (cardElement) {
        const routerLinks = cardElement.querySelectorAll('a[href], router-link, .router-link');
        routerLinks.forEach(link => {
          if (link.style) {
            link.style.pointerEvents = 'auto';
            link.style.zIndex = '100';
            link.style.cursor = 'pointer';
          }
          if (link instanceof HTMLElement) {
            link.setAttribute('tabindex', '0');
            link.classList.add('router-link-active');
          }
        });
      }
    };
    setTimeout(initRouterLinks, 0);
    setTimeout(initRouterLinks, 100);
    setTimeout(initRouterLinks, 300);
  });
});

function commitEdit() {
  editing.value = false;
  const fallback = props.algorithm.standardAlg;
  if (!localAlg.value) {
    localAlg.value = fallback;
  }
  if (savedTimer) {
    clearTimeout(savedTimer);
  }
  showSavedIndicator.value = true;
  savedTimer = setTimeout(() => {
    showSavedIndicator.value = false;
    savedTimer = null;
  }, 1000);
}

watch(nameEditing, async (value) => {
  if (value) {
    await nextTick();
    nameInputRef.value?.focus();
  }
});

watch(editing, async (value) => {
  if (value) {
    await nextTick();
    if (textareaRef.value) {
      textareaRef.value.focus();
      const el = textareaRef.value;
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }
});

function activateEditing() {
  showSavedIndicator.value = false;
  editing.value = true;
}

function handleEditButton() {
  if (editing.value) {
    if (textareaRef.value) {
      textareaRef.value.blur();
    } else {
      commitEdit();
    }
  } else {
    activateEditing();
  }
}

onMounted(() => {
  const modalEl = cubeModalRef.value;
  if (modalEl) {
    modalEl.addEventListener('shown.bs.modal', onCubeModalShown);
    modalEl.addEventListener('hidden.bs.modal', onCubeModalHidden);
  }

  // Ensure router-links are clickable in preview mode
  // Use multiple attempts with increasing delays for preview mode
  // This should work regardless of learned status
  const initRouterLinks = () => {
    const cardElement = document.querySelector(`.algorithm-card[data-algorithm-id="${props.algorithm.id}"]`);
    if (cardElement) {
      const routerLinks = cardElement.querySelectorAll('a[href], router-link, .router-link');
      routerLinks.forEach(link => {
        if (link.style) {
          link.style.pointerEvents = 'auto';
          link.style.zIndex = '100';
          link.style.cursor = 'pointer';
        }
        if (link instanceof HTMLElement) {
          link.setAttribute('tabindex', '0');
          
          // Add click handler - always use programmatic navigation as primary method
          const expectedPath = `/${props.mode}/${props.algorithm.id}`;
          const clickHandler = (event) => {
            // Always use programmatic navigation
            event.preventDefault();
            event.stopPropagation();
            router.push(expectedPath).catch(err => {
              if (err.name !== 'NavigationDuplicated') {
                console.warn('Router navigation failed:', err);
                window.location.href = expectedPath;
              }
            });
          };
          
          // Remove existing listener if any, then add new one
          link.removeEventListener('click', clickHandler);
          link.addEventListener('click', clickHandler, { once: false, capture: true });
        }
      });
    }
  };
  
  // Initialize immediately and with delays for preview mode
  nextTick(() => {
    initRouterLinks();
    setTimeout(initRouterLinks, 0);
    setTimeout(initRouterLinks, 50);
    setTimeout(initRouterLinks, 100);
    setTimeout(initRouterLinks, 200);
    setTimeout(initRouterLinks, 300);
    setTimeout(initRouterLinks, 500);
    setTimeout(initRouterLinks, 800);
    setTimeout(initRouterLinks, 1200);
  });
});


onBeforeUnmount(() => {
  const modalEl = cubeModalRef.value;
  if (modalEl) {
    modalEl.removeEventListener('shown.bs.modal', onCubeModalShown);
    modalEl.removeEventListener('hidden.bs.modal', onCubeModalHidden);
  }
  if (savedTimer) {
    clearTimeout(savedTimer);
  }
});
</script>

