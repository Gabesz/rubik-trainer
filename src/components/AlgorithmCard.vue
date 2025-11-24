<template>
  <div class="card algorithm-card" :class="{ learned }" :data-algorithm-id="algorithm.id">
    <div class="card-body d-flex flex-column">
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
        <h5 class="card-title">
          <router-link :to="`/${mode}/${algorithm.id}`" class="text-decoration-none">
            {{ algorithm.name }}
          </router-link>
        </h5>
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
        <button
          class="btn w-100 d-flex align-items-center justify-content-center gap-2"
          :class="learned ? 'btn-success' : 'btn-outline-secondary'"
          @click="$emit('toggle', algorithm.id)"
        >
          <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
            <path
              v-if="learned"
              fill="currentColor"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
            />
            <path
              v-else
              fill="currentColor"
              d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z"
            />
          </svg>
          <span>{{ learned ? 'Learned' : 'Mark as Learned' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount, onMounted, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

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
  showToggle: {
    type: Boolean,
    default: true,
  },
  myAlg: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['toggle', 'update-my-alg', 'filter-by-type']);

const localAlg = ref(props.myAlg || props.algorithm.standardAlg);
const editing = ref(false);
const textareaRef = ref(null);
const showSavedIndicator = ref(false);
let savedTimer = null;

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
  if (savedTimer) {
    clearTimeout(savedTimer);
  }
});
</script>

