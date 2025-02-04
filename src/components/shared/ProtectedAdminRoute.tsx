import { useAuthContext } from '@/contexts/authContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser } = useAuthContext();

  if (authUser?.user.rol === "USER" || authUser == null) {
    return <Navigate to="/auth/iniciar-sesion" replace />;
  }

  return <>{children}</>;
};