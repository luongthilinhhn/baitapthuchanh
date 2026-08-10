import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { ClassList } from './pages/classes/ClassList';
import { ClassDetail } from './pages/classes/ClassDetail';
import { MaterialHub } from './pages/materials/MaterialHub';
import { GameHub } from './pages/games/GameHub';
import { PlayGame } from './pages/games/PlayGame';
import { ExerciseHub } from './pages/exercises/ExerciseHub';
import { Profile } from './pages/Profile';

const DashboardRouter = () => {
  const { profile } = useAuth();

  if (profile?.role === 'admin') return <AdminDashboard />;
  if (profile?.role === 'teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
};

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardRouter />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ClassList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/classes/:classId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ClassDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exercises"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ExerciseHub />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/materials"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MaterialHub />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <GameHub />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/games/:gameId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PlayGame />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
