<template>
  <router-view />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from './composables/useTheme';

// Initialize theme - the composable handles everything
useTheme();

const router = useRouter();

// Cleanup function to remove modal backdrops and restore body state
function cleanupModals() {
  // Remove all backdrop elements
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  
  // Remove modal-open class from body
  document.body.classList.remove('modal-open');
  
  // Restore body styles
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  
  // Hide all modals that might still be visible
  const modals = document.querySelectorAll('.modal.show');
  modals.forEach(modal => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
    modal.style.display = 'none';
  });
}

// Clean up on route navigation
router.afterEach(() => {
  // Small delay to ensure this runs after Vue updates
  setTimeout(cleanupModals, 50);
});

// Clean up on browser back/forward navigation
function handlePopState() {
  setTimeout(cleanupModals, 50);
}

onMounted(() => {
  window.addEventListener('popstate', handlePopState);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handlePopState);
  cleanupModals();
});
</script>

