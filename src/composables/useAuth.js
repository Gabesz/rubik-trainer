import { ref } from 'vue';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

const currentUser = ref(null);
const loading = ref(true);

// Initialize auth state listener once at module level
let unsubscribeAuth = null;
if (typeof window !== 'undefined' && !unsubscribeAuth) {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    loading.value = false;
  });
}

export function useAuth() {
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to sign in' 
      };
    }
  };

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to sign up' 
      };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to sign out' 
      };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return { success: false, error: 'No user logged in' };
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await firebaseUpdatePassword(user, newPassword);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Failed to update password';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak (minimum 6 characters)';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign out and sign in again before changing password';
      }
      return { success: false, error: errorMessage };
    }
  };

  return {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    updatePassword
  };
}

