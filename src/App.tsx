import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WordsPage from './pages/WordsPage';
import GamesPage from './pages/GamesPage';
import LeitnerBoxPage from './pages/LeitnerBoxPage';
import MemoryGamePage from './pages/MemoryGamePage';
import WordleGamePage from './pages/WordleGamePage';
import WordSearchPage from './pages/WordSearchPage';
import { initializeDb } from './db/db';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">در حال بارگذاری...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/words" element={
        <ProtectedRoute>
          <WordsPage />
        </ProtectedRoute>
      } />
      <Route path="/games" element={
        <ProtectedRoute>
          <GamesPage />
        </ProtectedRoute>
      } />
      <Route path="/leitner" element={
        <ProtectedRoute>
          <LeitnerBoxPage />
        </ProtectedRoute>
      } />
      <Route path="/memory" element={
        <ProtectedRoute>
          <MemoryGamePage />
        </ProtectedRoute>
      } />
      <Route path="/wordle" element={
        <ProtectedRoute>
          <WordleGamePage />
        </ProtectedRoute>
      } />
      <Route path="/wordsearch" element={
        <ProtectedRoute>
          <WordSearchPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // Initialize the database on app load
    initializeDb();
  }, []);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;