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

                <div class="mb-3">
                  <h6 class="mb-2">Backup</h6>
                  <p class="small text-muted mb-2">
                    Export or import your progress, custom algorithms and names, list filters, and theme as a CSV file. The export lists every algorithm; my_alg is your custom moves or the default standard algorithm if unchanged. Email and password are never included.
                  </p>
                  <div class="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="btn btn-outline-primary flex-grow-1"
                      @click="handleExportData"
                      :disabled="!!backupBusy"
                    >
                      <span v-if="backupBusy === 'export'" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Export (.csv)
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary flex-grow-1"
                      @click="triggerImportFile"
                      :disabled="!!backupBusy"
                    >
                      <span v-if="backupBusy === 'import'" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Import (.csv)
                    </button>
                  </div>
                  <input
                    ref="importFileInput"
                    type="file"
                    class="d-none"
                    accept=".csv,text/csv"
                    aria-hidden="true"
                    @change="handleImportFile"
                  />
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
                <div class="mb-3">
                  <button
                    type="button"
                    class="btn auth-btn-google w-100 d-inline-flex align-items-center justify-content-center gap-2"
                    @click="handleGoogleSignIn"
                    :disabled="loading || oauthLoading"
                  >
                    <span v-if="oauthLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <svg v-else class="auth-btn-google__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C43.98 37.08 46.98 31.38 46.98 24.55z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.28-13.47-10.07l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
                <p class="text-center text-muted small text-uppercase mb-3 auth-modal-or">or</p>

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
                    :disabled="loading || oauthLoading"
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
                    :disabled="loading || oauthLoading || signupPassword !== signupPasswordConfirm"
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
import { ref, watch } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useUserData } from '../composables/useUserData';
import { useTheme } from '../composables/useTheme';
import {
  buildUserDataCsv,
  parseUserDataCsv,
  collectTrainingFromLocalStorage,
  collectTrainerPrefsFromLocalStorage,
  collectThemeFromLocalStorage,
  applyTrainingToLocalStorage,
  applyTrainerPrefsToLocalStorage,
  fetchAlgorithmExportCatalog,
  stripMyAlgsMatchingDefaults,
} from '../utils/userDataCsv';

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

const { currentUser, signIn, signUp, signOut, signInWithGoogle, updatePassword } = useAuth();
const { loadFullTrainingData, saveFullTrainingData } = useUserData();
const { setTheme } = useTheme();

const importFileInput = ref(null);
const backupBusy = ref('');

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
const oauthLoading = ref(false);

// Handle modal open/close - add/remove modal-open class from body
watch(() => props.show, (newVal) => {
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
    backupBusy.value = '';
    oauthLoading.value = false;
  }
});

// Watch for auth state changes
watch(currentUser, (newUser, oldUser) => {
  if (newUser && props.show && !oldUser) {
    message.value = 'Successfully signed in!';
    messageType.value = 'success';
    // Close modal after a delay
    setTimeout(() => {
      handleClose();
    }, 1500);
  }
});

const handleGoogleSignIn = async () => {
  message.value = '';
  messageType.value = '';
  oauthLoading.value = true;
  try {
    const result = await signInWithGoogle();
    if (result.success) {
      message.value = 'Successfully signed in!';
      messageType.value = 'success';
    } else if (!result.cancelled) {
      message.value = result.error || 'Failed to sign in with Google';
      messageType.value = 'error';
    }
  } finally {
    oauthLoading.value = false;
  }
};

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
  emit('close');
};

const handleBackdropClick = (event) => {
  if (event.target.classList.contains('modal-backdrop')) {
    handleClose();
  }
};

function triggerImportFile() {
  importFileInput.value?.click();
}

async function handleExportData() {
  message.value = '';
  messageType.value = '';
  backupBusy.value = 'export';

  try {
    let training;
    if (currentUser.value) {
      training = await loadFullTrainingData();
      if (!training) {
        message.value = 'Could not load your data for export.';
        messageType.value = 'error';
        return;
      }
    } else {
      training = collectTrainingFromLocalStorage();
    }

    const theme = collectThemeFromLocalStorage();
    const prefs = collectTrainerPrefsFromLocalStorage();
    const modeCatalog = await fetchAlgorithmExportCatalog();
    const csv = buildUserDataCsv(training, theme, prefs, modeCatalog);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rubik-trainer-backup-${stamp}.csv`;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.value = 'Export started — check your downloads.';
    messageType.value = 'success';
  } catch (err) {
    console.error(err);
    message.value = 'Export failed.';
    messageType.value = 'error';
  } finally {
    backupBusy.value = '';
  }
}

async function handleImportFile(event) {
  const input = event.target;
  const file = input?.files?.[0];
  if (input) input.value = '';
  if (!file) return;

  message.value = '';
  messageType.value = '';
  backupBusy.value = 'import';

  try {
    const text = await file.text();
    const parsed = parseUserDataCsv(text);
    if (parsed.error) {
      message.value = parsed.error;
      messageType.value = 'error';
      return;
    }

    const modeCatalog = await fetchAlgorithmExportCatalog();
    stripMyAlgsMatchingDefaults(parsed.training, modeCatalog);

    const ok = window.confirm(
      'Replace your current progress, custom algorithms, filters, and theme with this file? This cannot be undone.',
    );
    if (!ok) {
      return;
    }

    applyTrainingToLocalStorage(parsed.training);
    applyTrainerPrefsToLocalStorage(parsed.prefs);

    const th = parsed.theme === 'dark' || parsed.theme === 'light' ? parsed.theme : 'light';
    setTheme(th);

    if (currentUser.value) {
      const result = await saveFullTrainingData(parsed.training);
      if (!result.success) {
        message.value = result.error || 'Could not save to your account.';
        messageType.value = 'error';
        return;
      }
    }

    message.value = 'Data imported. Reloading…';
    messageType.value = 'success';
    setTimeout(() => {
      window.location.reload();
    }, 400);
  } catch (err) {
    console.error(err);
    message.value = 'Import failed.';
    messageType.value = 'error';
  } finally {
    backupBusy.value = '';
  }
}
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

html[data-bs-theme='dark'] .auth-modal-wrapper .modal-content,
html.dark-theme .auth-modal-wrapper .modal-content {
  background-color: var(--rt-color-surface-high);
  color: var(--rt-color-on-surface);
  border: 1px solid var(--rt-glass-border);
}

html[data-bs-theme='dark'] .auth-modal-wrapper .modal-header,
html.dark-theme .auth-modal-wrapper .modal-header {
  border-bottom-color: var(--rt-glass-border);
}

html[data-bs-theme='dark'] .auth-modal-wrapper .form-control,
html.dark-theme .auth-modal-wrapper .form-control {
  background-color: var(--rt-color-surface-low);
  border-color: var(--rt-glass-border);
  color: var(--rt-color-on-surface);
}

html[data-bs-theme='dark'] .auth-modal-wrapper .form-control:focus,
html.dark-theme .auth-modal-wrapper .form-control:focus {
  background-color: var(--rt-color-surface-low);
  border-color: var(--rt-color-primary-mid);
  color: var(--rt-color-on-surface);
}

.auth-modal-wrapper .auth-btn-google {
  font-weight: 600;
  color: #3c4043;
  background: #fff;
  border: 1px solid #dadce0;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.08);
}

.auth-modal-wrapper .auth-btn-google:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #dadce0;
  color: #202124;
}

.auth-modal-wrapper .auth-btn-google:focus-visible {
  outline: 2px solid rgba(66, 133, 244, 0.5);
  outline-offset: 2px;
}

.auth-modal-wrapper .auth-btn-google__icon {
  flex-shrink: 0;
}

html[data-bs-theme='dark'] .auth-modal-wrapper .auth-btn-google,
html.dark-theme .auth-modal-wrapper .auth-btn-google {
  color: #e8eaed;
  background: var(--rt-color-surface-low);
  border-color: var(--rt-glass-border);
}

html[data-bs-theme='dark'] .auth-modal-wrapper .auth-btn-google:hover:not(:disabled),
html.dark-theme .auth-modal-wrapper .auth-btn-google:hover:not(:disabled) {
  background: var(--rt-color-surface-high);
  color: #fff;
}

.auth-modal-or {
  letter-spacing: 0.12em;
  margin-top: -0.25rem;
}
</style>

