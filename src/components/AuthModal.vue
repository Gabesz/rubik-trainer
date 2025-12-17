<template>
  <Teleport to="body">
    <template v-if="show">
      <!-- Backdrop - separate from modal for proper stacking -->
      <div 
        class="auth-modal-backdrop" 
        @click="handleBackdropClick"
      ></div>
      <!-- Modal dialog -->
      <div
        class="auth-modal-wrapper modal fade show"
        :id="`authModal-${uniqueId}`"
        tabindex="-1"
        :aria-labelledby="`authModalLabel-${uniqueId}`"
        aria-hidden="false"
        style="display: block; z-index: 1055; position: fixed; top: 0; left: 0; width: 100%; height: 100%;"
        @click="handleBackdropClick"
      >
        <div class="modal-dialog modal-dialog-centered" style="z-index: 1055; position: relative;" @click.stop>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" :id="`authModalLabel-${uniqueId}`">
                <span v-if="currentUser">Profile</span>
                <span v-else-if="isLoginMode">Sign In</span>
                <span v-else>Sign Up</span>
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="handleClose"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <!-- Success/Error Messages -->
              <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'" role="alert">
                {{ message }}
              </div>

              <!-- Profile View (when logged in) -->
              <div v-if="currentUser" class="profile-view">
                <div class="mb-3">
                  <p class="mb-1"><strong>Email:</strong></p>
                  <p class="text-muted">{{ currentUser.email }}</p>
                </div>

                <!-- Change Password Section -->
                <div class="mb-3">
                  <button
                    v-if="!showChangePassword"
                    type="button"
                    class="btn btn-outline-secondary w-100"
                    @click="showChangePassword = true"
                  >
                    Change Password
                  </button>

                  <form v-else @submit.prevent="handleUpdatePassword">
                    <h6 class="mb-3">Change Password</h6>
                    <div class="mb-3">
                      <label for="currentPassword" class="form-label">Current Password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="currentPassword"
                        v-model="currentPasswordInput"
                        required
                        autocomplete="current-password"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="newPassword" class="form-label">New Password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="newPassword"
                        v-model="newPasswordInput"
                        required
                        autocomplete="new-password"
                        minlength="6"
                      />
                      <small class="form-text text-muted">Minimum 6 characters</small>
                    </div>
                    <div class="mb-3">
                      <label for="newPasswordConfirm" class="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="newPasswordConfirm"
                        v-model="newPasswordConfirm"
                        required
                        autocomplete="new-password"
                      />
                    </div>
                    <div class="d-flex gap-2">
                      <button
                        type="submit"
                        class="btn btn-primary flex-grow-1"
                        :disabled="loading || newPasswordInput !== newPasswordConfirm"
                      >
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Update Password
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="showChangePassword = false; currentPasswordInput = ''; newPasswordInput = ''; newPasswordConfirm = '';"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>

                <hr />

                <button
                  type="button"
                  class="btn btn-danger w-100"
                  @click="handleSignOut"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sign Out
                </button>
              </div>

              <!-- Auth Forms (when not logged in) -->
              <div v-else>
                <!-- Login Form -->
                <form v-if="isLoginMode" @submit.prevent="handleSignIn">
                  <div class="mb-3">
                    <label for="loginEmail" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="loginEmail"
                      v-model="loginEmail"
                      required
                      autocomplete="email"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="loginPassword" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="loginPassword"
                      v-model="loginPassword"
                      required
                      autocomplete="current-password"
                    />
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary w-100 mb-2"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sign In
                  </button>
                  <button
                    type="button"
                    class="btn btn-link w-100"
                    @click="isLoginMode = false"
                  >
                    Don't have an account? Sign up
                  </button>
                </form>

                <!-- Sign Up Form -->
                <form v-else @submit.prevent="handleSignUp">
                  <div class="mb-3">
                    <label for="signupEmail" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="signupEmail"
                      v-model="signupEmail"
                      required
                      autocomplete="email"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="signupPassword" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="signupPassword"
                      v-model="signupPassword"
                      required
                      autocomplete="new-password"
                      minlength="6"
                    />
                    <small class="form-text text-muted">Password must be at least 6 characters</small>
                  </div>
                  <div class="mb-3">
                    <label for="signupPasswordConfirm" class="form-label">Confirm Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="signupPasswordConfirm"
                      v-model="signupPasswordConfirm"
                      required
                      autocomplete="new-password"
                    />
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary w-100 mb-2"
                    :disabled="loading || signupPassword !== signupPasswordConfirm"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sign Up
                  </button>
                  <button
                    type="button"
                    class="btn btn-link w-100"
                    @click="isLoginMode = true"
                  >
                    Already have an account? Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useAuth } from '../composables/useAuth';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  uniqueId: {
    type: String,
    default: 'default'
  }
});

const emit = defineEmits(['close']);

const { currentUser, signIn, signUp, signOut, updatePassword } = useAuth();

const isLoginMode = ref(true);
const showChangePassword = ref(false);
const loginEmail = ref('');
const loginPassword = ref('');
const signupEmail = ref('');
const signupPassword = ref('');
const signupPasswordConfirm = ref('');
const currentPasswordInput = ref('');
const newPasswordInput = ref('');
const newPasswordConfirm = ref('');
const message = ref('');
const messageType = ref('');
const loading = ref(false);

// Handle modal open/close - add/remove modal-open class from body
watch(() => props.show, (newVal) => {
  console.log('AuthModal show prop changed:', newVal);
  if (newVal) {
    // Modal opening - add modal-open class to body
    document.body.classList.add('modal-open');
  } else {
    // Modal closing - remove modal-open class from body
    document.body.classList.remove('modal-open');
    // Clear form
    loginEmail.value = '';
    loginPassword.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
    signupPasswordConfirm.value = '';
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    newPasswordConfirm.value = '';
    showChangePassword.value = false;
    message.value = '';
    messageType.value = '';
    isLoginMode.value = true;
  }
});

// Watch for auth state changes
watch(currentUser, (newUser, oldUser) => {
  console.log('AuthModal currentUser watch:', { newUser: !!newUser, oldUser: !!oldUser, show: props.show });
  if (newUser && props.show && !oldUser) {
    message.value = 'Successfully signed in!';
    messageType.value = 'success';
    // Close modal after a delay
    setTimeout(() => {
      handleClose();
    }, 1500);
  }
});

const handleSignIn = async () => {
  message.value = '';
  messageType.value = '';
  loading.value = true;
  
  try {
    const result = await signIn(loginEmail.value, loginPassword.value);
    
    if (result.success) {
      message.value = 'Successfully signed in!';
      messageType.value = 'success';
      // Modal will close via watch
    } else {
      message.value = result.error || 'Failed to sign in';
      messageType.value = 'error';
    }
  } finally {
    loading.value = false;
  }
};

const handleSignUp = async () => {
  if (signupPassword.value !== signupPasswordConfirm.value) {
    message.value = 'Passwords do not match';
    messageType.value = 'error';
    return;
  }

  if (signupPassword.value.length < 6) {
    message.value = 'Password must be at least 6 characters';
    messageType.value = 'error';
    return;
  }

  message.value = '';
  messageType.value = '';
  loading.value = true;
  
  try {
    const result = await signUp(signupEmail.value, signupPassword.value);
    
    if (result.success) {
      message.value = 'Account created successfully!';
      messageType.value = 'success';
      // Modal will close via watch
    } else {
      message.value = result.error || 'Failed to sign up';
      messageType.value = 'error';
    }
  } finally {
    loading.value = false;
  }
};

const handleSignOut = async () => {
  message.value = '';
  messageType.value = '';
  loading.value = true;
  
  try {
    const result = await signOut();
    
    if (result.success) {
      message.value = 'Signed out successfully';
      messageType.value = 'success';
      setTimeout(() => {
        handleClose();
      }, 1000);
    } else {
      message.value = result.error || 'Failed to sign out';
      messageType.value = 'error';
    }
  } finally {
    loading.value = false;
  }
};

const handleUpdatePassword = async () => {
  if (newPasswordInput.value !== newPasswordConfirm.value) {
    message.value = 'New passwords do not match';
    messageType.value = 'error';
    return;
  }

  if (newPasswordInput.value.length < 6) {
    message.value = 'New password must be at least 6 characters';
    messageType.value = 'error';
    return;
  }

  message.value = '';
  messageType.value = '';
  loading.value = true;

  try {
    const result = await updatePassword(currentPasswordInput.value, newPasswordInput.value);
    
    if (result.success) {
      message.value = 'Password updated successfully!';
      messageType.value = 'success';
      currentPasswordInput.value = '';
      newPasswordInput.value = '';
      newPasswordConfirm.value = '';
      showChangePassword.value = false;
    } else {
      message.value = result.error || 'Failed to update password';
      messageType.value = 'error';
    }
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  console.log('AuthModal handleClose called');
  emit('close');
};

const handleBackdropClick = (event) => {
  console.log('AuthModal handleBackdropClick called', event.target, event.currentTarget);
  // Only close if clicking directly on the backdrop div
  if (event.target.classList.contains('modal-backdrop')) {
    console.log('Closing modal from backdrop click');
    handleClose();
  }
};
</script>

<style>
/* Auth Modal styles - NOT scoped because Teleport renders outside component tree */

/* Backdrop - separate element for proper stacking */
.auth-modal-backdrop {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  z-index: 1050 !important;
}

.auth-modal-wrapper.modal.show {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 1055 !important;
}

.auth-modal-wrapper .modal-dialog {
  z-index: 1055 !important;
}

.auth-modal-wrapper .profile-view {
  text-align: left;
}

html[data-bs-theme="dark"] .auth-modal-wrapper .modal-content,
html.dark-theme .auth-modal-wrapper .modal-content {
  background-color: #2d2d2d;
  color: #e0e0e0;
}

html[data-bs-theme="dark"] .auth-modal-wrapper .modal-header,
html.dark-theme .auth-modal-wrapper .modal-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme="dark"] .auth-modal-wrapper .form-control,
html.dark-theme .auth-modal-wrapper .form-control {
  background-color: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

html[data-bs-theme="dark"] .auth-modal-wrapper .form-control:focus,
html.dark-theme .auth-modal-wrapper .form-control:focus {
  background-color: #1a1a1a;
  border-color: #4a9eff;
  color: #e0e0e0;
}
</style>

