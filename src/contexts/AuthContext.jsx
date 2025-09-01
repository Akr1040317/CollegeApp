import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../firebase/entities';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = User.onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, displayName = null) => {
    try {
      const user = await User.signUp(email, password, displayName);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const user = await User.signIn(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await User.signInWithGoogle();
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await User.signOut();
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await User.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      await User.updateProfile(updates);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: User.isAuthenticated(),
    getUserId: User.getUserId(),
    getUserEmail: User.getUserEmail(),
    getDisplayName: User.getDisplayName()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
