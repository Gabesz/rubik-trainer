import { computed, ref } from 'vue';

export function useLearned(mode) {
  const STORAGE_KEY = `${mode}-learned`;
  const ALG_KEY = `${mode}-my-algs`;
  const learnedIds = ref([]);
  const myAlgs = ref({});
  let initialised = false;

  function loadFromStorage() {
    if (initialised || typeof window === 'undefined') {
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          learnedIds.value = parsed;
        }
      }
      const storedAlgs = window.localStorage.getItem(ALG_KEY);
      if (storedAlgs) {
        const parsedAlgs = JSON.parse(storedAlgs);
        if (parsedAlgs && typeof parsedAlgs === 'object') {
          myAlgs.value = parsedAlgs;
        }
      }
    } catch (error) {
      console.error(`Failed to read learned algorithms from storage (${mode}):`, error);
    }

    initialised = true;
  }

  function reloadFromStorage(newMode) {
    const storageKey = newMode ? `${newMode}-learned` : STORAGE_KEY;
    const algKey = newMode ? `${newMode}-my-algs` : ALG_KEY;
    
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          learnedIds.value = parsed;
        }
      } else {
        learnedIds.value = [];
      }
      const storedAlgs = window.localStorage.getItem(algKey);
      if (storedAlgs) {
        const parsedAlgs = JSON.parse(storedAlgs);
        if (parsedAlgs && typeof parsedAlgs === 'object') {
          myAlgs.value = parsedAlgs;
        } else {
          myAlgs.value = {};
        }
      } else {
        myAlgs.value = {};
      }
    } catch (error) {
      console.error(`Failed to reload learned algorithms from storage (${newMode || mode}):`, error);
      learnedIds.value = [];
      myAlgs.value = {};
    }
  }

  function persist(currentMode) {
    if (typeof window === 'undefined') {
      return;
    }

    const storageKey = currentMode ? `${currentMode}-learned` : STORAGE_KEY;
    const algKey = currentMode ? `${currentMode}-my-algs` : ALG_KEY;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(learnedIds.value));
      window.localStorage.setItem(algKey, JSON.stringify(myAlgs.value));
    } catch (error) {
      console.error(`Failed to persist learned algorithms (${currentMode || mode}):`, error);
    }
  }

  loadFromStorage();

  const learnedCount = computed(() => learnedIds.value.length);

  const isLearned = (id) => learnedIds.value.includes(id);

  const getMyAlg = (id) => myAlgs.value[id];

  const setMyAlg = (id, value, currentMode) => {
    myAlgs.value = {
      ...myAlgs.value,
      [id]: value,
    };
    persist(currentMode);
  };

  const resetMyAlgs = (currentMode) => {
    myAlgs.value = {};
    persist(currentMode);
  };

  const toggleLearned = (id, currentMode) => {
    const updated = new Set(learnedIds.value);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    learnedIds.value = Array.from(updated);
    persist(currentMode);
  };

  const resetLearned = (currentMode) => {
    learnedIds.value = [];
    persist(currentMode);
  };

  return {
    learnedIds,
    learnedCount,
    toggleLearned,
    resetLearned,
    isLearned,
    getMyAlg,
    setMyAlg,
    resetMyAlgs,
    reloadFromStorage,
  };
}

