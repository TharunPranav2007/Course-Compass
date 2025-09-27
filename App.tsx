
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LearningPathPage from './pages/LearningPathPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};


function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <HashRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="course/:courseId" element={<CourseDetailPage />} />
              <Route path="learning-path" element={<ProtectedRoute><LearningPathPage /></ProtectedRoute>} />
              <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </HashRouter>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
