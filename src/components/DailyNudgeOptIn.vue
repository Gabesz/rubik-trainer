<template>
  <div v-if="showBlock" :class="rootClass">
    <div class="card-body py-3 px-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3">
      <div class="flex-grow-1">
        <div class="fw-semibold">{{ $t('pushNudge.title') }}</div>
        <p class="small text-body-secondary mb-0">{{ $t('pushNudge.blurb') }}</p>
        <p v-if="errorMessage" class="small text-danger mb-0 mt-1">{{ errorMessage }}</p>
      </div>
      <div class="d-flex flex-shrink-0 gap-2">
        <button
          v-if="!subscribed"
          type="button"
          class="btn btn-sm btn-primary"
          :disabled="busy"
          @click="onEnable"
        >
          {{ busy ? '…' : $t('pushNudge.enable') }}
        </button>
        <button
          v-else
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :disabled="busy"
          @click="onDisable"
        >
          {{ $t('pushNudge.disable') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDailyNudgePush } from '../composables/useDailyNudgePush';

const props = defineProps({
  variant: {
    type: String,
    default: 'standalone',
    validator: (v) => v === 'standalone' || v === 'profile',
  },
});

const { t } = useI18n();
const { busy, error, subscribed, subscribe, unsubscribe } = useDailyNudgePush();

const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
const isTizenOS = typeof navigator !== 'undefined' && /Tizen/i.test(navigator.userAgent);

const showBlock = computed(
  () => !isInIframe && !isTizenOS && typeof window !== 'undefined' && 'Notification' in window
);

const rootClass = computed(() =>
  props.variant === 'profile'
    ? ['rt-daily-nudge', 'rt-daily-nudge--profile', 'card', 'border', 'mb-0']
    : ['rt-daily-nudge', 'card', 'border-0', 'shadow-sm', 'mt-3']
);

const errorMessage = computed(() => {
  switch (error.value) {
    case 'denied':
      return t('pushNudge.errorDenied');
    case 'unsupported':
      return t('pushNudge.errorUnsupported');
    case 'no_vapid':
      return t('pushNudge.errorNoVapid');
    case 'no_token':
    case 'failed':
      return t('pushNudge.errorFailed');
    default:
      return '';
  }
});

async function onEnable() {
  await subscribe();
}

async function onDisable() {
  await unsubscribe();
}
</script>

<style scoped>
.rt-daily-nudge {
  background: color-mix(in srgb, var(--rt-color-surface-elevated, var(--bs-body-bg)) 92%, transparent);
}

.rt-daily-nudge--profile {
  background: var(--bs-secondary-bg);
}
</style>
