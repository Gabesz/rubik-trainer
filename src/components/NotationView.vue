<template>
  <div class="notation-view">
    <div class="notation-columns">
      <!-- Left column: Basic notation (nagy betűs) -->
      <div class="notation-column">
        <div class="notation-cube-container">
          <div id="notation-animcube-basic" class="animcube-wrapper"></div>
        </div>
        <div class="notation-buttons-section">
          <h3 class="h5 mb-3">Basic notation</h3>
          <p class="text-muted small mb-3">
            U (Up), D (Down), L (Left), R (Right), F (Front), B (Back). Each letter = 90° clockwise. Apostrophe = counterclockwise. 2 = 180°.
          </p>
          <div class="notation-buttons">
            <div class="notation-row">
              <button
                v-for="move in basicMoves"
                :key="move"
                type="button"
                class="btn btn-outline-primary notation-btn"
                @click="applyMove('basic', move)"
              >
                {{ move }}
              </button>
            </div>
            <div class="notation-row">
              <button
                v-for="move in basicPrimeMoves"
                :key="move"
                type="button"
                class="btn btn-outline-primary notation-btn"
                @click="applyMove('basic', move)"
              >
                {{ move }}
              </button>
            </div>
            <div class="notation-row">
              <button
                v-for="move in basicDoubleMoves"
                :key="move"
                type="button"
                class="btn btn-outline-primary notation-btn"
                @click="applyMove('basic', move)"
              >
                {{ move }}
              </button>
            </div>
            <div class="notation-row">
              <button
                type="button"
                class="btn btn-outline-secondary notation-btn"
                @click="resetCube('basic')"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column: Double layer (kisbetűs) -->
      <div class="notation-column">
        <div class="notation-cube-container">
          <div id="notation-animcube-double" class="animcube-wrapper"></div>
        </div>
        <div class="notation-buttons-section">
          <h3 class="h5 mb-3">Double layer turns</h3>
          <p class="text-muted small mb-3">
            Lowercase letters: turn the face and the middle layer next to it together.
          </p>
          <div class="notation-buttons">
            <div class="notation-row">
              <button
                v-for="move in doubleLayerMoves"
                :key="move"
                type="button"
                class="btn btn-outline-primary notation-btn"
                @click="applyMove('double', move)"
              >
                {{ move }}
              </button>
            </div>
            <div class="notation-row">
              <button
                v-for="move in doubleLayerPrimeMoves"
                :key="move"
                type="button"
                class="btn btn-outline-primary notation-btn"
                @click="applyMove('double', move)"
              >
                {{ move }}
              </button>
            </div>
            <div class="notation-row">
              <button
                v-for="move in doubleLayerDoubleMoves"
                :key="move"
                type="button"
                class="btn btn-outline-primary notation-btn"
                @click="applyMove('double', move)"
              >
                {{ move }}
              </button>
            </div>
            <div class="notation-row">
              <button
                type="button"
                class="btn btn-outline-secondary notation-btn"
                @click="resetCube('double')"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const CUBE_ID_BASIC = 'notation-animcube-basic';
const CUBE_ID_DOUBLE = 'notation-animcube-double';
const cubeReady = ref(false);

const basicMoves = ['U', 'D', 'L', 'R', 'F', 'B'];
const basicPrimeMoves = ["U'", "D'", "L'", "R'", "F'", "B'"];
const basicDoubleMoves = ['U2', 'D2', 'L2', 'R2', 'F2', 'B2'];

const doubleLayerMoves = ['u', 'd', 'l', 'r', 'f', 'b'];
const doubleLayerPrimeMoves = ["u'", "d'", "l'", "r'", "f'", "b'"];
const doubleLayerDoubleMoves = ['u2', 'd2', 'l2', 'r2', 'f2', 'b2'];

function getCubeId(type) {
  return type === 'basic' ? CUBE_ID_BASIC : CUBE_ID_DOUBLE;
}

function applyMove(type, move) {
  if (!cubeReady.value || !window.acjs_move || !window.acjs_getMove || !window.acjs_startAnimation) return;
  const id = getCubeId(type);
  if (!window.acjs_move[id] || !window.acjs_getMove[id] || !window.acjs_startAnimation[id]) return;

  try {
    const moveData = window.acjs_getMove[id](move, 0);
    if (moveData && moveData[0]) {
      window.acjs_move[id][0] = moveData[0];
      window.acjs_startAnimation[id](0);
    }
  } catch (e) {
    console.warn('AnimCube applyMove error:', e);
  }
}

function resetCube(type) {
  if (!cubeReady.value || !window.acjs_clear) return;
  const id = getCubeId(type);
  if (!window.acjs_clear[id]) return;

  if (window.acjs_get_var && window.acjs_get_var[id] && window.acjs_stopAnimation && window.acjs_stopAnimation[id]) {
    if (window.acjs_get_var[id]('animating')) {
      window.acjs_stopAnimation[id]();
      setTimeout(() => resetCube(type), 50);
      return;
    }
  }
  window.acjs_clear[id]();
}

function initAnimCube() {
  if (typeof window.AnimCube3 !== 'function') return;

  window.acjs_removeListeners = window.acjs_removeListeners || [];
  window.acjs_move = window.acjs_move || [];
  window.acjs_getMove = window.acjs_getMove || [];
  window.acjs_startAnimation = window.acjs_startAnimation || [];
  window.acjs_clear = window.acjs_clear || [];
  window.acjs_get_var = window.acjs_get_var || [];
  window.acjs_stopAnimation = window.acjs_stopAnimation || [];

  const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark' ||
    document.documentElement.classList.contains('dark-theme');
  const bgcolor = isDark ? '2d2d2d' : 'ffffff';

  const baseParams = `buttonbar=0&counter=0&bgcolor=${bgcolor}&snap=1&yz=1&edit=1`;

  [CUBE_ID_BASIC, CUBE_ID_DOUBLE].forEach((cubeId) => {
    if (window.acjs_removeListeners[cubeId]) {
      window.acjs_removeListeners[cubeId]();
    }
    window.AnimCube3(`id=${cubeId}&${baseParams}`);
  });
  cubeReady.value = true;
}

onMounted(() => {
  if (typeof window.AnimCube3 !== 'function') {
    const script = document.createElement('script');
    script.src = 'https://animcubejs.cubing.net/AnimCube3.js';
    script.onload = () => {
      initAnimCube();
    };
    document.head.appendChild(script);
  } else {
    initAnimCube();
  }
});

onBeforeUnmount(() => {
  cubeReady.value = false;
  [CUBE_ID_BASIC, CUBE_ID_DOUBLE].forEach((cubeId) => {
    if (window.acjs_removeListeners && window.acjs_removeListeners[cubeId]) {
      window.acjs_removeListeners[cubeId]();
    }
  });
});
</script>

<style scoped>
.notation-view {
  width: 100%;
  padding: 1rem;
}

.notation-columns {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 992px) {
  .notation-columns {
    flex-direction: row;
    gap: 2rem;
  }

  .notation-column {
    flex: 1;
    min-width: 0;
  }
}

.notation-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notation-cube-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  min-height: 350px;
  width: 100%;
}

.animcube-wrapper {
  width: 100%;
  max-width: 400px;
  height: 400px;
  min-height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#notation-animcube-basic,
#notation-animcube-double {
  width: 100%;
  height: 100%;
  min-width: 280px;
  min-height: 280px;
}

.notation-buttons-section {
  width: 100%;
  max-width: 500px;
}

.notation-buttons-section h3 {
  text-align: center;
}

.notation-buttons-section p {
  text-align: center;
}

.notation-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.notation-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.notation-btn {
  min-width: 2.5rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.notation-btn:hover {
  transform: scale(1.02);
}

/* Dark mode - AnimCube background */
html[data-bs-theme="dark"] .animcube-wrapper,
html.dark-theme .animcube-wrapper {
  --animcube-bg: #2d2d2d;
}
</style>
