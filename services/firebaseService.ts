import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../firebase/config';
import { UserProfile, Gender, DietType, HealthCondition } from '../types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const createAuthUserWithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation = {}
): Promise<UserProfile> => {
  if (!userAuth) throw new Error("No user provided");

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = serverTimestamp();
    const newUserProfile: UserProfile = {
      uid: userAuth.uid,
      displayName: displayName || 'New User',
      email: email || '',
      age: null,
      gender: Gender.PREFER_NOT_TO_SAY,
      dietType: DietType.NONE,
      healthCondition: HealthCondition.NONE,
      allergies: [],
      ...additionalInformation,
    };

    try {
      await setDoc(userDocRef, { ...newUserProfile, createdAt });
      return newUserProfile;
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }
  return userSnapshot.data() as UserProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) return null;
  const userDocRef = doc(db, 'users', uid);
  const userSnapshot = await getDoc(userDocRef);
  return userSnapshot.exists() ? (userSnapshot.data() as UserProfile) : null;
};

export const updateUserProfileDocument = async (uid: string, profileData: Partial<UserProfile>): Promise<void> => {
  if (!uid) throw new Error("No user ID provided");
  const userDocRef = doc(db, 'users', uid);
  try {
    // Use setDoc with merge: true to create the document if it doesn't exist, or update it if it does.
    // This prevents errors when trying to update a profile that wasn't created on signup.
    await setDoc(userDocRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error setting user profile document:', error);
    throw error;
  }
};