<template>
  <section class="training-panel">
    <div v-if="algorithm" class="training-stage d-flex justify-content-center align-items-center">
      <div class="algorithm-card display-card">
        <div class="card-body text-center">
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
            <p class="font-monospace h5">{{ algorithm.setup }}</p>
          </div>
          <div class="mb-4" v-if="showMyAlg">
            <p class="font-monospace display-standard" v-html="formattedMyAlg"></p>
          </div>
          <div v-if="showStandard">
            <p class="text-muted mb-1">Standard Algorithm</p>
            <p class="font-monospace display-standard fw-bold" v-html="formattedStandard"></p>
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
import { computed, toRefs } from 'vue';

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
});

defineEmits(['new', 'back']);

const { algorithm } = toRefs(props);

const formattedStandard = computed(() => {
  const text = algorithm.value?.standardAlg ?? '';
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

