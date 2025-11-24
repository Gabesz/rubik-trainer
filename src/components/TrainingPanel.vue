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
          <h3 class="mb-3">{{ algorithm.name }}</h3>
          <div class="mb-4">
            <p class="text-muted mb-1">Setup</p>
            <div class="display-standard-wrapper">
              <p class="font-monospace h5" v-html="formattedSetup"></p>
            </div>
          </div>
          <div class="mb-4" v-if="showMyAlg">
            <p class="font-monospace display-standard" v-html="formattedMyAlg"></p>
          </div>
          <div v-if="showStandard">
            <p class="text-muted mb-1">Standard Algorithm</p>
            <div class="display-standard-wrapper">
              <p 
                class="font-monospace display-standard fw-bold" 
                :class="{ 
                  'standard-alg-blur': shouldBlur,
                  'blur-revealed': isBlurRevealed 
                }"
                @click="shouldBlur && revealBlur()"
                v-html="formattedStandard"
              ></p>
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
  </section>
</template>

<script setup>
import { computed, ref, toRefs, watch } from 'vue';

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
});

defineEmits(['new', 'back']);

const { algorithm } = toRefs(props);
const isBlurRevealed = ref(false);

// Reset blur when algorithm changes
watch(algorithm, () => {
  isBlurRevealed.value = false;
});

function revealBlur() {
  isBlurRevealed.value = !isBlurRevealed.value;
}

const formattedStandard = computed(() => {
  const text = algorithm.value?.standardAlg ?? '';
  if (!text) return '';
  return text
    .replace(/\)/g, ')<wbr>')
    .replace(/\s+/g, '&nbsp;');
});

const formattedSetup = computed(() => {
  const text = algorithm.value?.setup ?? '';
  if (!text) return '';
  return text
    .replace(/\)/g, ')<wbr>')
    .replace(/\s+/g, '&nbsp;');
});

const formattedMyAlg = computed(() => {
  const text = props.myAlg || '';
  return text
    .replace(/\)/g, ')<wbr>')
    .replace(/\s+/g, '&nbsp;');
});

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

