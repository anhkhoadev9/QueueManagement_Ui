import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import KioskPage from './pages/KioskPage';
import TellerDashboard from './pages/TellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QueuePage from './pages/QueuePage';
import FeedbackPage from './pages/FeedbackPage';
import GoogleCallback from './pages/GoogleCallback';
import NotFoundPage from './pages/NotFoundPage';
import SubmitFeedbackPage from './pages/SubmitFeedbackPage';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Fully Public Routes (no auth needed) */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/track/:id" element={<TicketTrackPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Authenticated User Routes */}
          <Route element={<PublicLayout />}>
            <Route
              path="/kiosk"
              element={
                <ProtectedRoute allowedRoles={['admin', 'user']}>
                  <KioskPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit-feedback"
              element={
                <ProtectedRoute allowedRoles={['admin', 'user']}>
                  <SubmitFeedbackPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin / Staff Routes with Sidebar */}
          <Route element={<AdminLayout />}>
            <Route
              path="/teller"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <TellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedbacks"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <FeedbackPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
