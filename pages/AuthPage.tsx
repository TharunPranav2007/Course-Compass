
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const AuthPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="max-w-md w-full bg-secondary p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to Course Compass</h1>
        <p className="text-light mb-8">
          This is a demonstration app. Click below to log in with a mock user account to explore all features.
        </p>
        <div className="space-y-4">
            <Button onClick={handleLogin} className="w-full">
              Login as Demo User
            </Button>
            <p className="text-sm text-tertiary">In a real application, you would see options for email/password, Google, and GitHub login here.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
