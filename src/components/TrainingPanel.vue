<template>
  <section class="training-panel">
    <div v-if="algorithm" class="training-stage d-flex justify-content-center align-items-center">
      <div class="algorithm-card display-card">
        <div class="card-body text-center d-flex flex-column">
          <div class="mb-4">
            <img
              :src="algorithm.imageUrl"
              :alt="`Diagram for ${algorithm.name}`"
              class="img-fluid display-image"
            />
          </div>
          <div class="d-flex justify-content-center align-items-center gap-2 mb-3">
            <template v-if="nameEditing">
              <input
                type="text"
                class="form-control form-control-sm d-inline-block training-name-edit"
                v-model="localName"
                @blur="commitNameEdit"
                @keydown.enter="commitNameEdit"
                @keydown.escape="cancelNameEdit"
                ref="nameInputRef"
              />
            </template>
            <h3 v-else class="mb-0 training-name-display" @click="handleNameClick" title="Click to edit name">
              {{ displayName }}
            </h3>
            <button
              type="button"
              class="btn btn-primary btn-sm d-flex align-items-center gap-1"
              data-bs-toggle="modal"
              :data-bs-target="`#cubeModal-${algorithm.id}`"
              title="Play 3D animation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
              </svg>
              <span>Play</span>
            </button>
          </div>
          <div class="mb-4 text-center px-3">
            <p class="text-muted mb-1">Setup</p>
            <div class="display-standard-wrapper text-center">
              <div class="font-monospace h5 algorithm-moves-container">
                <span
                  v-for="(item, index) in setupMoves"
                  :key="`setup-${index}`"
                  class="algorithm-move"
                  :class="{ 'algorithm-move-group': item.isGroup }"
                >
                  {{ item.move }}
                </span>
              </div>
            </div>
          </div>
          <div class="mb-4 text-center" v-if="showMyAlg">
            <div class="font-monospace display-standard algorithm-moves-container">
              <span
                v-for="(item, index) in myAlgMoves"
                :key="`myalg-${index}`"
                class="algorithm-move"
                :class="{ 'algorithm-move-group': item.isGroup }"
              >
                {{ item.move }}
              </span>
            </div>
          </div>
          <div v-if="showStandard" class="text-center px-3">
            <p class="text-muted mb-1">Standard Algorithm</p>
            <div class="display-standard-wrapper text-center">
              <div 
                class="font-monospace display-standard fw-bold algorithm-moves-container" 
                :class="{ 
                  'standard-alg-blur': shouldBlur,
                  'blur-revealed': isBlurRevealed 
                }"
                @click="shouldBlur && revealBlur()"
              >
                <span
                  v-for="(item, index) in algorithmMoves"
                  :key="`alg-${index}`"
                  class="algorithm-move"
                  :class="{ 'algorithm-move-group': item.isGroup }"
                >
                  {{ item.move }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-auto pt-4 d-flex gap-2 justify-content-center align-items-center training-panel-buttons">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              @click="$emit('back')"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
              <span>Back</span>
            </button>
            <button
              type="button"
              class="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
              @click="$emit('new')"
              :disabled="learnedCount <= 1"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
              </svg>
              <span>New Training</span>
            </button>
            <a
              v-if="algorithm.detailUrl"
              :href="algorithm.detailUrl"
              target="_blank"
              rel="noopener"
              class="btn btn-outline-primary btn-sm text-decoration-none d-flex align-items-center gap-2"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
                <path fill="currentColor" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path fill="currentColor" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
              <span>Details</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-secondary text-center mb-0">
      No learned algorithms yet. Mark some cases as learned to start training.
    </div>
    
    <!-- 3D Cube Animation Modal -->
    <div
      v-if="algorithm"
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
              <strong v-if="!displayName.toUpperCase().startsWith(trainerMode.toUpperCase())">{{ trainerMode }}</strong>
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
              ref="rubikCube3DRef"
              :algorithm="algorithm.standardAlg || myAlg"
              :setup="algorithm.setup"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, toRefs, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import RubikCube3D from './RubikCube3D.vue';

const route = useRoute();

const props = defineProps({
  algorithm: {
    type: Object,
    default: null,
  },
  learnedCount: {
    type: Number,
    default: 0,
  },
  myAlg: {
    type: String,
    default: '',
  },
  shouldBlur: {
    type: Boolean,
    default: false,
  },
  myName: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['new', 'back', 'update-my-name']);

const { algorithm } = toRefs(props);
const isBlurRevealed = ref(false);

const displayName = computed(() => {
  const custom = props.myName;
  if (custom !== undefined && custom !== null && String(custom).trim() !== '') {
    return String(custom).trim();
  }
  return algorithm.value?.name ?? '';
});

const localName = ref(
  ((props.myName && String(props.myName).trim()) || algorithm.value?.name) ?? ''
);
const nameEditing = ref(false);
const nameInputRef = ref(null);

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
  const defaultName = algorithm.value?.name ?? '';
  if (trimmed === '' || trimmed === defaultName) {
    emit('update-my-name', algorithm.value?.id, '');
  } else {
    emit('update-my-name', algorithm.value?.id, trimmed);
  }
}

function cancelNameEdit() {
  nameEditing.value = false;
  localName.value = displayName.value;
}

// Trainer mode meghatározása a route-ból
const trainerMode = computed(() => {
  const path = route.path;
  if (path.startsWith('/f2l')) return 'F2L';
  if (path.startsWith('/oll')) return 'OLL';
  if (path.startsWith('/pll')) return 'PLL';
  return 'OLL'; // default
});

// Reset blur when algorithm changes
watch(algorithm, () => {
  isBlurRevealed.value = false;
});

function revealBlur() {
  isBlurRevealed.value = !isBlurRevealed.value;
}

// Algoritmus mozgások listája - zárójelek közé csoportosítva
const algorithmMoves = computed(() => {
  const text = algorithm.value?.standardAlg ?? '';
  if (!text) return [];
  return parseAlgorithmWithGroups(text);
});

// Setup mozgások listája - zárójelek közé csoportosítva
const setupMoves = computed(() => {
  const text = algorithm.value?.setup ?? '';
  if (!text) return [];
  return parseAlgorithmWithGroups(text);
});

// MyAlg mozgások listája - zárójelek közé csoportosítva
const myAlgMoves = computed(() => {
  const text = props.myAlg || '';
  if (!text) return [];
  return parseAlgorithmWithGroups(text);
});

// Algoritmus feldolgozása zárójelek szerint csoportosítva
function parseAlgorithmWithGroups(text) {
  const moves = text.split(/\s+/).filter(m => m.trim().length > 0);
  const result = [];
  let inGroup = false;
  let currentGroup = [];
  
  moves.forEach((move, index) => {
    const startsWithParen = move.startsWith('(');
    const endsWithParen = move.endsWith(')');
    
    if (startsWithParen) {
      inGroup = true;
      currentGroup = [move];
    } else if (inGroup) {
      currentGroup.push(move);
      if (endsWithParen) {
        // Zárójel csoport vége - egyetlen elemként kezeljük
        // Nincs automatikus sortörés, csak ha a flex konténer úgy dönt
        result.push({
          move: currentGroup.join(' '),
          isGroup: true,
          breakAfter: false // Nincs automatikus sortörés
        });
        currentGroup = [];
        inGroup = false;
      }
    } else {
      // Normál mozgás zárójelek nélkül
      result.push({
        move,
        isGroup: false,
        breakAfter: false
      });
    }
  });
  
  // Ha maradt valami a currentGroup-ban (hibás formátum esetén)
  if (currentGroup.length > 0) {
    result.push({
      move: currentGroup.join(' '),
      isGroup: true,
      breakAfter: false
    });
  }
  
  return result;
}


const hasMyAlg = computed(() => {
  return (props.myAlg || '').trim().length > 0;
});

const showMyAlg = computed(() => {
  const standard = (algorithm.value?.standardAlg || '').trim();
  const mine = (props.myAlg || '').trim();
  return mine.length > 0 && mine !== standard;
});

const showStandard = computed(() => {
  return !hasMyAlg.value;
});
</script>

