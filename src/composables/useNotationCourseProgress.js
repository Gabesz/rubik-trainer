import { ref, computed, watch } from 'vue';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '../config/firebase';
import { useAuth } from './useAuth';

const STORAGE_KEY = 'rubik-trainer-notation-course';

function readRaw() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeRaw(data) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

function defaultState() {
  return {
    beginnerDone: false,
    intermediateDone: false,
    advancedDone: false,
    updatedAt: null,
  };
}

function normalizeState(raw) {
  if (!raw || typeof raw !== 'object') return defaultState();
  return {
    beginnerDone: raw.beginnerDone === true,
    intermediateDone: raw.intermediateDone === true,
    advancedDone: raw.advancedDone === true,
    updatedAt: raw.updatedAt ?? null,
  };
}

function mergeNotation(local, remote) {
  const a = normalizeState(local);
  const b = normalizeState(remote);
  return {
    beginnerDone: a.beginnerDone || b.beginnerDone,
    intermediateDone: a.intermediateDone || b.intermediateDone,
    advancedDone: a.advancedDone || b.advancedDone,
    updatedAt: new Date().toISOString(),
  };
}

const existingLocal = readRaw();
const state = ref(normalizeState(existingLocal));

let authHydrationStarted = false;

async function pushNotationToCloud(uid) {
  const payload = normalizeState(state.value);
  const userDocRef = doc(db, 'users', uid);
  await setDoc(
    userDocRef,
    {
      notationCourse: {
        beginnerDone: payload.beginnerDone,
        intermediateDone: payload.intermediateDone,
        advancedDone: payload.advancedDone,
        updatedAt: payload.updatedAt,
      },
    },
    { merge: true },
  );
}

async function pullNotationFromCloud(uid) {
  const userDocRef = doc(db, 'users', uid);
  const snap = await getDoc(userDocRef);
  const remote = snap.exists() ? snap.data()?.notationCourse : null;
  const merged = mergeNotation(state.value, remote);
  state.value = merged;
  writeRaw(merged);
  try {
    await pushNotationToCloud(uid);
  } catch (e) {
    console.warn('Notation course cloud sync (push after merge) failed:', e);
  }
}

function ensureAuthHydration() {
  if (authHydrationStarted || typeof window === 'undefined') return;
  authHydrationStarted = true;
  const { currentUser } = useAuth();
  watch(
    currentUser,
    (u) => {
      if (!u?.uid) return;
      pullNotationFromCloud(u.uid).catch((e) => {
        console.warn('Notation course cloud load failed:', e);
      });
    },
    { immediate: true },
  );
}

/**
 * Notation course unlocks (separate from CFOP linear step progress).
 * Shared module state + localStorage; optional Firestore `users/{uid}.notationCourse` when signed in.
 */
export function useNotationCourseProgress() {
  ensureAuthHydration();

  function persist() {
    state.value = { ...state.value, updatedAt: new Date().toISOString() };
    writeRaw(state.value);
    const uid = useAuth().currentUser.value?.uid;
    if (uid) {
      pushNotationToCloud(uid).catch((e) => {
        console.warn('Notation course cloud save failed:', e);
      });
    }
  }

  const beginnerDone = computed(() => state.value.beginnerDone === true);
  const intermediateDone = computed(() => state.value.intermediateDone === true);
  const advancedDone = computed(() => state.value.advancedDone === true);

  const intermediateUnlocked = computed(() => beginnerDone.value);
  const advancedUnlocked = computed(() => intermediateDone.value);

  function markBeginnerComplete() {
    if (state.value.beginnerDone) return;
    state.value = { ...state.value, beginnerDone: true };
    persist();
  }

  function markIntermediateComplete() {
    if (state.value.intermediateDone) return;
    state.value = { ...state.value, intermediateDone: true };
    persist();
  }

  function markAdvancedComplete() {
    if (state.value.advancedDone) return;
    state.value = { ...state.value, advancedDone: true };
    persist();
  }

  return {
    state,
    beginnerDone,
    intermediateDone,
    advancedDone,
    intermediateUnlocked,
    advancedUnlocked,
    markBeginnerComplete,
    markIntermediateComplete,
    markAdvancedComplete,
    persist,
  };
}
