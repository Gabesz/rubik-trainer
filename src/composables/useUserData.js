import { ref } from 'vue';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export function useUserData() {
  const { currentUser } = useAuth();
  const loading = ref(false);
  const error = ref(null);

  // Get user document reference
  const getUserDocRef = () => {
    if (!currentUser.value) return null;
    return doc(db, 'users', currentUser.value.uid);
  };

  // Load user data for a specific mode
  const loadUserData = async (mode) => {
    if (!currentUser.value) {
      return { learnedIds: [], myAlgs: {} };
    }

    loading.value = true;
    error.value = null;

    try {
      const userDocRef = getUserDocRef();
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          learnedIds: data.learned?.[mode] || [],
          myAlgs: data.myAlgs?.[mode] || {}
        };
      } else {
        // Create initial document structure
        await setDoc(userDocRef, {
          learned: {
            [mode]: []
          },
          myAlgs: {
            [mode]: {}
          }
        });
        return { learnedIds: [], myAlgs: {} };
      }
    } catch (err) {
      error.value = err.message;
      console.error('Failed to load user data:', err);
      return { learnedIds: [], myAlgs: {} };
    } finally {
      loading.value = false;
    }
  };

  // Save learned IDs for a specific mode
  const saveLearnedIds = async (mode, ids) => {
    if (!currentUser.value) return { success: false, error: 'Not authenticated' };

    loading.value = true;
    error.value = null;

    try {
      const userDocRef = getUserDocRef();
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          [`learned.${mode}`]: ids
        });
      } else {
        await setDoc(userDocRef, {
          learned: {
            [mode]: ids
          },
          myAlgs: {}
        });
      }
      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error('Failed to save learned IDs:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Save my algorithms for a specific mode
  const saveMyAlgs = async (mode, algs) => {
    if (!currentUser.value) return { success: false, error: 'Not authenticated' };

    loading.value = true;
    error.value = null;

    try {
      const userDocRef = getUserDocRef();
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          [`myAlgs.${mode}`]: algs
        });
      } else {
        await setDoc(userDocRef, {
          learned: {},
          myAlgs: {
            [mode]: algs
          }
        });
      }
      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error('Failed to save my algorithms:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Subscribe to real-time updates for user data
  const subscribeToUserData = (mode, callback) => {
    if (!currentUser.value) {
      callback({ learnedIds: [], myAlgs: {} });
      return () => {};
    }

    const userDocRef = getUserDocRef();
    const unsubscribe = onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          callback({
            learnedIds: data.learned?.[mode] || [],
            myAlgs: data.myAlgs?.[mode] || {}
          });
        } else {
          callback({ learnedIds: [], myAlgs: {} });
        }
      },
      (err) => {
        console.error('Error subscribing to user data:', err);
        callback({ learnedIds: [], myAlgs: {} });
      }
    );

    return unsubscribe;
  };

  // Migrate localStorage data to Firebase
  const migrateLocalStorageToFirebase = async (mode) => {
    if (!currentUser.value) return { success: false, error: 'Not authenticated' };

    try {
      const storageKey = `${mode}-learned`;
      const algKey = `${mode}-my-algs`;
      
      const storedLearned = window.localStorage.getItem(storageKey);
      const storedAlgs = window.localStorage.getItem(algKey);

      const learnedIds = storedLearned ? JSON.parse(storedLearned) : [];
      const myAlgs = storedAlgs ? JSON.parse(storedAlgs) : {};

      // Only migrate if there's data to migrate
      if (learnedIds.length > 0 || Object.keys(myAlgs).length > 0) {
        const userDocRef = getUserDocRef();
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Merge with existing data (don't overwrite)
          const existingData = userDoc.data();
          const existingLearned = existingData.learned?.[mode] || [];
          const existingAlgs = existingData.myAlgs?.[mode] || {};

          const mergedLearned = [...new Set([...existingLearned, ...learnedIds])];
          const mergedAlgs = { ...existingAlgs, ...myAlgs };

          await updateDoc(userDocRef, {
            [`learned.${mode}`]: mergedLearned,
            [`myAlgs.${mode}`]: mergedAlgs
          });
        } else {
          await setDoc(userDocRef, {
            learned: {
              [mode]: learnedIds
            },
            myAlgs: {
              [mode]: myAlgs
            }
          });
        }

        // Mark as migrated
        window.localStorage.setItem(`${mode}-migrated`, 'true');
      }

      return { success: true };
    } catch (err) {
      console.error('Failed to migrate localStorage to Firebase:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    loading,
    error,
    loadUserData,
    saveLearnedIds,
    saveMyAlgs,
    subscribeToUserData,
    migrateLocalStorageToFirebase
  };
}

