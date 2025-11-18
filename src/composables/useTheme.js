import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'theme-preference';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

const currentTheme = ref(THEME_LIGHT);
let initialized = false;

function loadTheme() {
  if (typeof window === 'undefined' || initialized) {
    return;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === THEME_DARK || stored === THEME_LIGHT) {
      currentTheme.value = stored;
    } else {
      // Default to light if no preference stored
      currentTheme.value = THEME_LIGHT;
    }
  } catch (error) {
    console.error('Failed to load theme preference:', error);
    currentTheme.value = THEME_LIGHT;
  }
  
  initialized = true;
  applyTheme(currentTheme.value);
}

function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return;
  }

  const html = document.documentElement;
  if (theme === THEME_DARK) {
    html.setAttribute('data-bs-theme', 'dark');
    html.classList.add('dark-theme');
    html.classList.remove('light-theme');
  } else {
    html.setAttribute('data-bs-theme', 'light');
    html.classList.add('light-theme');
    html.classList.remove('dark-theme');
  }
}

function saveTheme(theme) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}

function toggleTheme() {
  const newTheme = currentTheme.value === THEME_DARK ? THEME_LIGHT : THEME_DARK;
  setTheme(newTheme);
}

function setTheme(theme) {
  if (theme !== THEME_DARK && theme !== THEME_LIGHT) {
    return;
  }
  currentTheme.value = theme;
  applyTheme(theme);
  saveTheme(theme);
}

// Initialize on module load
if (typeof window !== 'undefined') {
  loadTheme();
}

watch(currentTheme, (newTheme) => {
  applyTheme(newTheme);
});

export function useTheme() {
  // Ensure theme is loaded
  loadTheme();

  const isDark = computed(() => currentTheme.value === THEME_DARK);
  const isLight = computed(() => currentTheme.value === THEME_LIGHT);

  return {
    currentTheme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
  };
}

