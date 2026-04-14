<template>
  <div :class="rootClass">
    <label :class="labelClass" :for="selectId">{{ $t('language.label') }}</label>
    <select :id="selectId" v-model="localeModel" class="form-select" :class="selectClass">
      <option value="en">{{ $t('language.en') }}</option>
      <option value="hu">{{ $t('language.hu') }}</option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LOCALE_STORAGE_KEY, syncHtmlLang } from '../i18n';
import { syncEngagementLocaleIfSubscribed } from '../push/syncEngagementLocale';

const props = defineProps({
  variant: {
    type: String,
    default: 'navbar',
    validator: (v) => v === 'navbar' || v === 'landing' || v === 'profile',
  },
  idSuffix: {
    type: String,
    default: 'main',
  },
});

const { locale } = useI18n();

const selectId = computed(() => `rt-lang-${props.idSuffix}`);

const rootClass = computed(() => {
  const v = props.variant;
  return [
    'rt-lang-switch',
    v === 'landing' ? 'rt-lang-switch--landing' : v === 'profile' ? 'rt-lang-switch--profile' : 'rt-lang-switch--navbar',
  ];
});

const labelClass = computed(() =>
  props.variant === 'profile' ? 'form-label small mb-1' : 'visually-hidden'
);

const selectClass = computed(() => {
  if (props.variant === 'landing') return 'form-select-sm rt-lang-switch__select';
  if (props.variant === 'profile') return 'form-select';
  return 'form-select-sm';
});

const localeModel = computed({
  get: () => locale.value,
  set: (v) => {
    if (v !== 'en' && v !== 'hu') return;
    locale.value = v;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, v);
    } catch (_) {
      /* ignore */
    }
    syncHtmlLang(v);
    syncEngagementLocaleIfSubscribed(v);
  },
});
</script>

<style scoped>
.rt-lang-switch--navbar .form-select {
  width: auto;
  min-width: 6.75rem;
  max-width: 9rem;
}

.rt-lang-switch--landing .form-select {
  border: 1px solid var(--rt-glass-border);
  border-radius: 999px;
  background: var(--rt-glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: var(--rt-color-on-surface);
  padding: 0.35rem 2rem 0.35rem 0.75rem;
  box-shadow: var(--rt-shadow-card);
}

.rt-lang-switch--landing .form-select:focus {
  border-color: var(--rt-color-primary-mid);
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--rt-color-primary) 22%, transparent);
}

.rt-lang-switch--profile {
  width: 100%;
}

.rt-lang-switch--profile .form-select {
  width: 100%;
  max-width: none;
}
</style>
