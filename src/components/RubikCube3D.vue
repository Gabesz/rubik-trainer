<template>
  <div class="rubik-cube-container">
    <div class="algorithm-text mb-2 text-center">
      <div v-if="setup" class="setup-text small mb-1">
        <strong>Setup:</strong> 
        <span class="font-monospace">
          <span
            v-for="(move, index) in setupMoves"
            :key="`setup-${index}`"
            class="algorithm-move"
            :class="{ 
              'active-move': activeMoveIndex && activeMoveIndex.type === 'setup' && activeMoveIndex.index === index,
              'disabled': !isPlayerReady
            }"
            @click="isPlayerReady && jumpToMove('setup', index)"
            :title="isPlayerReady ? `Ugorj erre a lépésre (${index + 1}/${setupMoves.length})` : 'Várj, amíg a player betöltődik...'"
          >
            {{ move }}
          </span>
        </span>
      </div>
      <div class="algorithm-text-main">
        <strong>Algorithm:</strong> 
        <span class="font-monospace">
          <span
            v-for="(move, index) in algorithmMoves"
            :key="`alg-${index}`"
            class="algorithm-move"
            :class="{ 
              'active-move': activeMoveIndex && activeMoveIndex.type === 'algorithm' && activeMoveIndex.index === index,
              'disabled': !isPlayerReady
            }"
            @click="isPlayerReady && jumpToMove('algorithm', index)"
            :title="isPlayerReady ? `Ugorj erre a lépésre (${index + 1}/${algorithmMoves.length})` : 'Várj, amíg a player betöltődik...'"
          >
            {{ move }}
          </span>
        </span>
      </div>
    </div>
    <twisty-player
      :key="playerKey"
      ref="twistyPlayerRef"
      :alg="algorithm"
      :experimental-setup-alg="setup"
      puzzle="3x3x3"
      hint-facelets="none"
      background="none"
      camera-latitude="180"
     
      style="width: 100%; max-width: 500px; height: 500px;"
    ></twisty-player>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  algorithm: {
    type: String,
    required: true,
  },
  setup: {
    type: String,
    default: '',
  },
});

const twistyPlayerRef = ref(null);
const playerKey = ref(0);
const currentTimestamp = ref(0);
const isPlayerReady = ref(false);

// Setup algoritmus (ha van) - experimental-setup-alg prop-hoz
// x2 rotáció a legelején: fehér alul, sárga felül orientáció (alapértelmezett: sárga alul, fehér felül)
const setup = computed(() => {
  const baseSetup = props.setup && props.setup.trim() ? props.setup.trim() : '';
  return baseSetup ? `x2 ${baseSetup}` : 'x2';
});

// Fő algoritmus - alg prop-hoz
const algorithm = computed(() => {
  return props.algorithm && props.algorithm.trim() ? props.algorithm.trim() : '';
});

// Setup időtartama másodpercekben (körülbelül 0.5 másodperc per mozgás)
const setupDuration = computed(() => {
  if (!setup.value) return 0;
  const setupMoves = setup.value.split(/\s+/).filter(m => m.trim().length > 0);
  return setupMoves.length * 0.5;
});

// Setup mozgások listája
const setupMoves = computed(() => {
  if (!setup.value) return [];
  return setup.value.split(/\s+/).filter(m => m.trim().length > 0);
});

// Algoritmus mozgások listája
const algorithmMoves = computed(() => {
  if (!algorithm.value) return [];
  return algorithm.value.split(/\s+/).filter(m => m.trim().length > 0);
});

// Jelenleg aktív lépés indexe (-1 ha nincs aktív)
const activeMoveIndex = computed(() => {
  const timestamp = currentTimestamp.value;
  
  // Ha a setup-ban vagyunk
  if (setup.value && timestamp > 0 && timestamp < setupDuration.value) {
    // A timestamp alapján számoljuk, hogy melyik lépésnél tartunk
    // Minden lépés kb. 0.5 másodperc, de lehet, hogy változó
    const moveIndex = Math.min(Math.floor(timestamp / 0.5), setupMoves.value.length - 1);
    return { type: 'setup', index: moveIndex };
  }
  
  // Ha az algoritmusban vagyunk
  if (timestamp >= setupDuration.value) {
    const algorithmTimestamp = timestamp - setupDuration.value;
    const moveIndex = Math.min(Math.floor(algorithmTimestamp / 0.5), algorithmMoves.value.length - 1);
    return { type: 'algorithm', index: moveIndex };
  }
  
  // Ha a setup után vagyunk, de még nem kezdődött el az algoritmus
  if (setup.value && timestamp >= setupDuration.value && timestamp < setupDuration.value + 0.1) {
    // Még nem kezdődött el az algoritmus, nincs aktív lépés
    return null;
  }
  
  return null;
});

// Ugrás egy adott lépésre
function jumpToMove(type, index) {
  const player = twistyPlayerRef.value;
  if (!player) return;
  
  // Próbáljuk meg több módon is elérni a timeline-t
  let timeline = null;
  
  if (player.timeline) {
    timeline = player.timeline;
  } else if (player.experimentalModel && player.experimentalModel.twistySceneModel) {
    timeline = player.experimentalModel.twistySceneModel.timeline;
  }
  
  if (!timeline) return;
  
  try {
    let targetTimestamp = 0;
    
    if (type === 'setup') {
      // Setup lépés: számoljuk a timestamp-et (0.5 másodperc per lépés)
      targetTimestamp = index * 0.5;
    } else if (type === 'algorithm') {
      // Algoritmus lépés: setup időtartama + lépés index * 0.5
      targetTimestamp = setupDuration.value + (index * 0.5);
    }
    
    // Beállítjuk a timeline-t
    if (timeline.setTimestamp) {
      timeline.setTimestamp(targetTimestamp);
    } else if (timeline.jumpToTimestamp) {
      timeline.jumpToTimestamp(targetTimestamp);
    } else {
      return;
    }
    
    // Frissítjük az aktuális timestamp-et
    currentTimestamp.value = targetTimestamp;
    
    // Ha játszik, folytatjuk
    if (player.play) {
      player.play();
    }
    
  } catch (e) {
    // Timeline not ready yet
  }
}

// Beállítja a timeline-t a setup utáni állapotba
function setToSetupEnd() {
  const player = twistyPlayerRef.value;
  if (!player) return;
  
  // Próbáljuk meg több módon is elérni a timeline-t
  let timeline = null;
  
  if (player.timeline) {
    timeline = player.timeline;
  } else if (player.experimentalModel && player.experimentalModel.twistySceneModel) {
    timeline = player.experimentalModel.twistySceneModel.timeline;
  }
  
  if (!timeline) return;
  
  try {
    // experimental-setup-alg nélkül experimental-setup-anchor="end" nélkül:
    // - A timeline 0 időpontja = megoldott állapot
    // - A setup utáni állapot = setup időtartama
    // Beállítjuk a timeline-t a setup végére
    if (setup.value) {
      timeline.setTimestamp(setupDuration.value);
    } else {
      // Nincs setup, csak az elejére állítjuk
      timeline.setTimestamp(0);
    }
  } catch (e) {
    // Timeline not ready yet
  }
}

// A beépített vezérlő panel használata, de a reset gombot felülírjuk
// hogy a setup utáni állapotba állítsa vissza

// Figyeljük az algoritmus változását
watch(() => [props.algorithm, props.setup], () => {
  // Amikor az algoritmus vagy a setup változik, beállítjuk a timeline-t a setup utáni állapotba
  // Próbáljuk meg többször, mert a twisty-player lehet, hogy még nem kész
  nextTick(() => {
    setToSetupEnd();
    setTimeout(() => setToSetupEnd(), 100);
    setTimeout(() => setToSetupEnd(), 300);
  });
});

onMounted(() => {
  // Betöltjük a twisty-player scriptet, ha még nincs betöltve
  if (!customElements.get('twisty-player')) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.cubing.net/js/cubing/twisty';
    document.head.appendChild(script);
  }
  
  // Várunk, amíg a twisty-player betöltődik, majd beállítjuk a timeline-t a setup utáni állapotba
  // Próbáljuk meg többször, mert a twisty-player aszinkron betöltődik
  const trySetInitialState = () => {
    const player = twistyPlayerRef.value;
    if (player) {
      // Próbáljuk meg több módon is elérni a timeline-t
      let timeline = null;
      
      if (player.timeline) {
        timeline = player.timeline;
      } else if (player.experimentalModel && player.experimentalModel.twistySceneModel) {
        timeline = player.experimentalModel.twistySceneModel.timeline;
      }
      
      if (timeline) {
        isPlayerReady.value = true;
        setToSetupEnd();
      }
      
      // Frissítjük az aktuális timestamp-et
      const updateTimestamp = () => {
        if (!timeline) return;
        
        try {
          // Próbáljuk meg több módon is elérni a timestamp-et
          let timestamp = null;
          
          // Először próbáljuk a közvetlen timestamp property-t
          if (timeline.timestamp !== undefined && timeline.timestamp !== null) {
            timestamp = timeline.timestamp;
          }
          // Ha nincs, próbáljuk a getTimestamp metódust
          else if (timeline.getTimestamp && typeof timeline.getTimestamp === 'function') {
            try {
              timestamp = timeline.getTimestamp();
            } catch (e) {}
          }
          // Ha nincs, próbáljuk a currentTime property-t
          else if (timeline.currentTime !== undefined && timeline.currentTime !== null) {
            timestamp = timeline.currentTime;
          }
          // Próbáljuk a player-t is
          else if (player && player.timeline && player.timeline.timestamp !== undefined) {
            timestamp = player.timeline.timestamp;
          }
          
          if (timestamp !== null && timestamp !== undefined) {
            const oldTimestamp = currentTimestamp.value;
            // Mindig frissítjük, még akkor is, ha ugyanaz az érték, hogy a computed property-k újraszámolódjanak
            currentTimestamp.value = timestamp;
            
            // Ha változott a timestamp, kiírjuk az aktuális lépést
            if (Math.abs(oldTimestamp - timestamp) > 0.01) {
              // Közvetlenül számoljuk az aktuális lépést
              let activeMove = null;
              
              // Ha a setup-ban vagyunk
              if (setup.value && timestamp > 0 && timestamp < setupDuration.value) {
                const moveIndex = Math.min(Math.floor(timestamp / 0.5), setupMoves.value.length - 1);
                const move = setupMoves.value[moveIndex];
                if (move) {
                  activeMove = { type: 'setup', move, index: moveIndex, total: setupMoves.value.length };
                }
              }
              // Ha az algoritmusban vagyunk
              else if (timestamp >= setupDuration.value) {
                const algorithmTimestamp = timestamp - setupDuration.value;
                const moveIndex = Math.min(Math.floor(algorithmTimestamp / 0.5), algorithmMoves.value.length - 1);
                const move = algorithmMoves.value[moveIndex];
                if (move) {
                  activeMove = { type: 'algorithm', move, index: moveIndex, total: algorithmMoves.value.length };
                }
              }
              
            }
          }
        } catch (e) {}
      };
      
      // Először azonnal frissítjük
      updateTimestamp();
      
      // Próbáljuk meg a player eseményeit is figyelni
      if (player && player.addEventListener) {
        // Figyeljük a player eseményeit
        player.addEventListener('move', updateTimestamp);
        player.addEventListener('play', updateTimestamp);
        player.addEventListener('pause', updateTimestamp);
      }
      
      // Polling - folyamatosan frissítjük a timestamp-et (gyakoribb, hogy biztosan működjön)
      const interval = setInterval(() => {
        if (twistyPlayerRef.value && twistyPlayerRef.value.timeline) {
          updateTimestamp();
        } else {
          clearInterval(interval);
        }
      }, 100); // 100ms, hogy ne legyen túl gyakori
      
      // Tároljuk az interval-t, hogy törölhessük később
      if (!window.twistyPlayerIntervals) {
        window.twistyPlayerIntervals = [];
      }
      window.twistyPlayerIntervals.push(interval);
      
      // Felülírjuk a beépített reset gomb működését
      // A reset gomb a setup utáni állapotba állítja vissza a kockát
      if (player && player.experimentalModel) {
        // Figyeljük a timeline változásait, és ha a reset gombot nyomják,
        // beállítjuk a timeline-t a setup utáni állapotba
        const originalReset = player.restart;
        if (originalReset) {
          player.restart = function() {
            originalReset.call(this);
            // Várunk egy kicsit, hogy a reset befejeződjön
            setTimeout(() => {
              setToSetupEnd();
            }, 50);
          };
        }
      }
    } else {
      // Ha még nincs betöltve, várunk egy kicsit és újra próbáljuk
      setTimeout(trySetInitialState, 100);
    }
  };
  
  // Először 500ms után próbáljuk
  setTimeout(trySetInitialState, 500);
  // Majd 1 másodperc után is
  setTimeout(trySetInitialState, 1000);
  // És 2 másodperc után is
  setTimeout(trySetInitialState, 2000);
});
</script>

<style scoped>
.rubik-cube-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.algorithm-text {
  max-width: 500px;
  width: 100%;
  color: #000 !important;
}

.algorithm-text * {
  color: #000 !important;
}

.algorithm-text .font-monospace {
  word-break: break-all;
  line-height: 1.5;
  color: #000 !important;
}

.algorithm-text .setup-text {
  color: #000 !important;
}

.algorithm-text .setup-text strong {
  color: #000 !important;
}

.algorithm-text .algorithm-text-main {
  color: #000 !important;
}

.algorithm-text .algorithm-text-main strong {
  color: #000 !important;
}

.algorithm-move {
  display: inline-block;
  padding: 2px 4px;
  margin: 0 2px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s ease;
  color: #000;
}

.algorithm-move:hover {
  background-color: rgba(255, 193, 7, 0.3);
}

.algorithm-move.active-move {
  background-color: #ffc107 !important;
  color: #000 !important;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 0 8px rgba(255, 193, 7, 0.6);
}

/* Dark mode - fehér betűk */
html[data-bs-theme="dark"] .algorithm-text,
html.dark-theme .algorithm-text {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text *,
html.dark-theme .algorithm-text * {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .font-monospace,
html.dark-theme .algorithm-text .font-monospace {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .setup-text,
html.dark-theme .algorithm-text .setup-text {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .setup-text strong,
html.dark-theme .algorithm-text .setup-text strong {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .algorithm-text-main,
html.dark-theme .algorithm-text .algorithm-text-main {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-text .algorithm-text-main strong,
html.dark-theme .algorithm-text .algorithm-text-main strong {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-move,
html.dark-theme .algorithm-move {
  color: #fff !important;
}

html[data-bs-theme="dark"] .algorithm-move.active-move,
html.dark-theme .algorithm-move.active-move {
  background-color: #ffc107 !important;
  color: #000 !important;
}

</style>
