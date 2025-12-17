<template>
  <div class="user-icon-container">
    <button
      type="button"
      class="btn btn-link nav-link user-icon-btn"
      :class="{ 'not-logged-in': !currentUser }"
      :id="`userIcon-${uniqueId}`"
      @click.stop.prevent="toggleModal"
      :title="currentUser ? 'Profile' : 'Sign in'"
      aria-label="User account"
    >
      <svg v-if="currentUser" aria-hidden="true" viewBox="0 0 16 16" width="24" height="24">
        <path fill="currentColor" d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
      </svg>
      <svg v-else aria-hidden="true" viewBox="0 0 16 16" width="24" height="24">
        <path fill="currentColor" d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
      </svg>
    </button>
    <AuthModal 
      :show="showModal" 
      @close="closeModal"
      :unique-id="uniqueId"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import AuthModal from './AuthModal.vue';

const props = defineProps({
  uniqueId: {
    type: String,
    default: 'default'
  }
});

const { currentUser } = useAuth();
const showModal = ref(false);

const toggleModal = (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  console.log('toggleModal called, current state:', showModal.value);
  
  // Use nextTick to ensure the click event is fully processed before opening modal
  if (!showModal.value) {
    // Opening modal - delay slightly to avoid immediate backdrop click
    setTimeout(() => {
      showModal.value = true;
      console.log('toggleModal new state (delayed):', showModal.value);
    }, 10);
  } else {
    // Closing modal - immediate
    showModal.value = false;
    console.log('toggleModal new state:', showModal.value);
  }
};

const closeModal = () => {
  console.log('UserIcon closeModal called');
  showModal.value = false;
};

// Close modal when user signs in/out
onMounted(() => {
  // Watch for auth state changes
  const unwatch = () => {
    if (showModal.value && currentUser.value) {
      // Small delay to show success message
      setTimeout(() => {
        closeModal();
      }, 1500);
    }
  };
  
  // This will be handled by AuthModal's watch
});
</script>

<style scoped>
.user-icon-container {
  display: flex;
  align-items: center;
}

.user-icon-btn {
  padding: 0.5rem;
  color: #495057;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #dee2e6;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-radius: 50%;
  width: 42px;
  height: 42px;
}

.user-icon-btn.not-logged-in {
  border-color: #0d6efd;
  background: #ffffff;
  color: #0d6efd;
}

.user-icon-btn:hover {
  color: #0d6efd;
  border-color: #0d6efd;
  background: rgba(13, 110, 253, 0.1);
  transform: scale(1.05);
}

.user-icon-btn:focus-visible {
  outline: 2px solid rgba(13, 110, 253, 0.5);
  outline-offset: 2px;
  border-color: #0d6efd;
}

html[data-bs-theme="dark"] .user-icon-btn,
html.dark-theme .user-icon-btn {
  color: #e0e0e0;
  background: #2d2d2d;
  border-color: #4a4a4a;
}

html[data-bs-theme="dark"] .user-icon-btn.not-logged-in,
html.dark-theme .user-icon-btn.not-logged-in {
  border-color: #4a9eff;
  background: #ffffff;
  color: #4a9eff;
}

html[data-bs-theme="dark"] .user-icon-btn:hover,
html.dark-theme .user-icon-btn:hover {
  color: #4a9eff;
  border-color: #4a9eff;
  background: rgba(74, 158, 255, 0.15);
}

html[data-bs-theme="dark"] .user-icon-btn.not-logged-in:hover,
html.dark-theme .user-icon-btn.not-logged-in:hover {
  border-color: #4a9eff;
  background: rgba(74, 158, 255, 0.1);
  color: #0d6efd;
}

</style>

