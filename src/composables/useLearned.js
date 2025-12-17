import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';

export function useLearned(mode) {
  const STORAGE_KEY = `${mode}-learned`;
  const ALG_KEY = `${mode}-my-algs`;
  const learnedIds = ref([]);
  const myAlgs = ref({});
  let initialised = false;
  let firebaseUnsubscribe = null;
  let migrationDone = false;

  const { currentUser } = useAuth();
  const { 
    loadUserData, 
    saveLearnedIds, 
    saveMyAlgs, 
    subscribeToUserData,
    migrateLocalStorageToFirebase 
  } = useUserData();

  // Check if using Firebase (user is logged in)
  const useFirebase = computed(() => !!currentUser.value);

  async function loadFromStorage() {
    if (initialised || typeof window === 'undefined') {
      return;
    }

    if (useFirebase.value) {
      // Load from Firebase
      try {
        const data = await loadUserData(mode);
        learnedIds.value = data.learnedIds || [];
        myAlgs.value = data.myAlgs || {};
        
        // Migrate localStorage data if not already migrated
        if (!migrationDone) {
          const migrated = window.localStorage.getItem(`${mode}-migrated`);
          if (!migrated) {
            await migrateLocalStorageToFirebase(mode);
            migrationDone = true;
            // Reload after migration
            const migratedData = await loadUserData(mode);
            learnedIds.value = migratedData.learnedIds || [];
            myAlgs.value = migratedData.myAlgs || {};
          }
        }

        // Subscribe to real-time updates
        if (firebaseUnsubscribe) {
          firebaseUnsubscribe();
        }
        firebaseUnsubscribe = subscribeToUserData(mode, (data) => {
          learnedIds.value = data.learnedIds || [];
          myAlgs.value = data.myAlgs || {};
        });
      } catch (error) {
        console.error(`Failed to load user data from Firebase (${mode}):`, error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } else {
      // Load from localStorage
      loadFromLocalStorage();
    }

    initialised = true;
  }

  function loadFromLocalStorage() {
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
  }

  async function reloadFromStorage(newMode) {
    const targetMode = newMode || mode;
    const storageKey = `${targetMode}-learned`;
    const algKey = `${targetMode}-my-algs`;
    
    initialised = false; // Reset initialization to allow reload

    if (useFirebase.value) {
      try {
        const data = await loadUserData(targetMode);
        learnedIds.value = data.learnedIds || [];
        myAlgs.value = data.myAlgs || {};
        
        // Unsubscribe old and subscribe to new mode
        if (firebaseUnsubscribe) {
          firebaseUnsubscribe();
        }
        firebaseUnsubscribe = subscribeToUserData(targetMode, (data) => {
          learnedIds.value = data.learnedIds || [];
          myAlgs.value = data.myAlgs || {};
        });
      } catch (error) {
        console.error(`Failed to reload user data from Firebase (${targetMode}):`, error);
        // Fallback to localStorage
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
      }
    } else {
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
        console.error(`Failed to reload learned algorithms from storage (${targetMode}):`, error);
        learnedIds.value = [];
        myAlgs.value = {};
      }
    }

    initialised = true;
  }

  async function persist(currentMode) {
    if (typeof window === 'undefined') {
      return;
    }

    const targetMode = currentMode || mode;
    const storageKey = `${targetMode}-learned`;
    const algKey = `${targetMode}-my-algs`;

    if (useFirebase.value) {
      // Save to Firebase
      try {
        await Promise.all([
          saveLearnedIds(targetMode, learnedIds.value),
          saveMyAlgs(targetMode, myAlgs.value)
        ]);
      } catch (error) {
        console.error(`Failed to persist to Firebase (${targetMode}):`, error);
        // Fallback to localStorage
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(learnedIds.value));
          window.localStorage.setItem(algKey, JSON.stringify(myAlgs.value));
        } catch (localError) {
          console.error(`Failed to persist to localStorage (${targetMode}):`, localError);
        }
      }
    } else {
      // Save to localStorage
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(learnedIds.value));
        window.localStorage.setItem(algKey, JSON.stringify(myAlgs.value));
      } catch (error) {
        console.error(`Failed to persist learned algorithms (${targetMode}):`, error);
      }
    }
  }

  // Watch for auth state changes
  watch(currentUser, async (newUser, oldUser) => {
    if (newUser && !oldUser) {
      // User just logged in - migrate and load from Firebase
      initialised = false;
      migrationDone = false;
      await loadFromStorage();
    } else if (!newUser && oldUser) {
      // User just logged out - switch to localStorage
      if (firebaseUnsubscribe) {
        firebaseUnsubscribe();
        firebaseUnsubscribe = null;
      }
      initialised = false;
      loadFromLocalStorage();
    }
  });

  // Cleanup on unmount
  onBeforeUnmount(() => {
    if (firebaseUnsubscribe) {
      firebaseUnsubscribe();
      firebaseUnsubscribe = null;
    }
  });

  loadFromStorage();

  const learnedCount = computed(() => learnedIds.value.length);

  const isLearned = (id) => learnedIds.value.includes(id);

  const getMyAlg = (id) => myAlgs.value[id];

  const setMyAlg = async (id, value, currentMode) => {
    myAlgs.value = {
      ...myAlgs.value,
      [id]: value,
    };
    await persist(currentMode);
  };

  const resetMyAlgs = async (currentMode) => {
    myAlgs.value = {};
    await persist(currentMode);
  };

  const toggleLearned = async (id, currentMode) => {
    const updated = new Set(learnedIds.value);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    learnedIds.value = Array.from(updated);
    await persist(currentMode);
  };

  const resetLearned = async (currentMode) => {
    learnedIds.value = [];
    await persist(currentMode);
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

