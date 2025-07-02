import { 
  getDoc, 
  setDoc, 
  updateDoc,  // Adicione esta importação
  doc,
  collection
} from 'firebase/firestore';
import { db } from './firebase';

const safeFirestoreOperation = async (operation, ...args) => {
  try {
    const MAX_RETRIES = 3;
    let lastError;
    
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        return await operation(...args);
      } catch (error) {
        lastError = error;
        if (error.code === 'cancelled' || error.code === 'aborted') {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        throw error;
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error('Firestore operation failed:', error);
    throw error;
  }
};

export const safeGetDoc = (ref) => safeFirestoreOperation(getDoc, ref);
export const safeSetDoc = (ref, data) => safeFirestoreOperation(setDoc, ref, data);
export const safeUpdateDoc = (ref, data) => safeFirestoreOperation(updateDoc, ref, data);  