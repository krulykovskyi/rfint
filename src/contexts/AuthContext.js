import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import {
  setUser,
  setLoading,
  setError,
  logout,
} from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        try {
          // Get user document from Firestore to check role
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          const userData = {
            uid: user.uid,
            email: user.email,
            role: userDoc.exists() ? userDoc.data().role : 'user', // Default to 'user' role
            displayName: user.displayName,
          };

          dispatch(setUser(userData));
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch(setError(error.message));
        }
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const value = {
    login,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
