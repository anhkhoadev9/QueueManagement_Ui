import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import KioskPage from './pages/KioskPage';
import PublicDisplayPage from './pages/PublicDisplayPage';
import TellerDashboard from './pages/TellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes without Sidebar */}
          <Route element={<PublicLayout />}>
            <Route path="/kiosk" element={<KioskPage />} />
            <Route path="/display" element={<PublicDisplayPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Admin/Teller Routes with Sidebar */}
          <Route element={<AdminLayout />}>
            <Route path="/teller" element={<TellerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

