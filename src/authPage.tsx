// src/pages/AuthPage.tsx
import { AuthForm } from './authForm';
import { useAuth } from './AuthProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // If you use react-router

export const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If already signed in, bounce to the protected area
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthForm />
    </div>
  );
};
