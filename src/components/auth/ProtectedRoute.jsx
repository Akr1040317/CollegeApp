import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from './AuthForm';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthForm />;
  }

  return children;
}
